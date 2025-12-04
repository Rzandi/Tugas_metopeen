<?php

return [

    /*
    |--------------------------------------------------------------------------
    | L5 OpenAPI Documentation
    |--------------------------------------------------------------------------
    |
    | This configuration file specifies the open API version and security
    | scheme for the L5-Swagger package.
    |
    */

    'default' => 'default',
    'paths' => [
        'docs' => 'api-docs',
        'use_this' => 'this.json',
    ],
    'routes' => [
        'docs' => 'api/documentation',
        'docs_json' => 'api/documentation.json',
        'oauth2_callback' => 'api/oauth2-callback',
        'middleware' => ['api', 'cors'],
        'group_middleware' => [],
    ],
    'specs' => [
        'default' => [
            'title' => 'Frozen Food Management API',
            'description' => 'API documentation for Frozen Food Management System',
            'version' => '1.0.0',
            'host' => env('SWAGGER_HOST', 'localhost:8000'),
            'schemes' => [env('APP_ENV') === 'production' ? 'https' : 'http'],
            'security' => [
                'sanctum' => [],
            ],
        ],
    ],
    'securitySchemes' => [
        'sanctum' => [
            'type' => 'apiKey',
            'description' => 'Enter token prefixed with Bearer',
            'name' => 'Authorization',
            'in' => 'header',
        ],
    ],
    'generate_always' => false,
    'generate_yaml_copy' => false,
    'proxy' => false,
    'additional_config_url' => null,
    'operations_sort' => null,
    'union_types_support' => false,
];
