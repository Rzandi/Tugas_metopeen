from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from contextlib import asynccontextmanager


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB client (will be initialized in lifespan)
client: Optional[AsyncIOMotorClient] = None
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    global client, db
    
    # Startup
    try:
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        logger.info("✅ Connected to MongoDB successfully")
        
        # Test the connection
        await client.admin.command('ping')
        logger.info("✅ MongoDB connection verified")
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        raise
    
    yield
    
    # Shutdown
    if client:
        client.close()
        logger.info("✅ MongoDB connection closed")

# Create the main app with lifespan
app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    """
    Health check endpoint
    """
    logger.info("Health check endpoint called")
    return {"message": "Hello World", "status": "healthy"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    """
    Create a new status check entry
    """
    try:
        logger.info(f"Creating status check for client: {input.client_name}")
        
        status_dict = input.model_dump()
        status_obj = StatusCheck(**status_dict)
        
        # Convert to dict and serialize datetime to ISO string for MongoDB
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        result = await db.status_checks.insert_one(doc)
        
        if not result.inserted_id:
            logger.error("Failed to insert status check")
            raise HTTPException(status_code=500, detail="Failed to create status check")
        
        logger.info(f"✅ Status check created successfully with ID: {status_obj.id}")
        return status_obj
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error creating status check: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    """
    Get all status checks
    """
    try:
        logger.info("Fetching all status checks")
        
        # Exclude MongoDB's _id field from the query results
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO string timestamps back to datetime objects
        for check in status_checks:
            if isinstance(check['timestamp'], str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])
        
        logger.info(f"✅ Retrieved {len(status_checks)} status checks")
        return status_checks
        
    except Exception as e:
        logger.error(f"❌ Error fetching status checks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"❌ Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred"}
    )