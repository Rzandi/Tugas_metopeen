<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

/**
 * Base Service Class
 * Provides common functionality for all services
 */
abstract class BaseService
{
    protected $model;

    public function __construct()
    {
        $this->model = $this->getModel();
    }

    /**
     * Get the model instance
     * Must be implemented by child classes
     */
    abstract protected function getModel(): Model;

    /**
     * Get all records with pagination
     */
    public function getAll($limit = 10, $page = 1)
    {
        return $this->model
            ->paginate($limit, ['*'], 'page', $page);
    }

    /**
     * Get record by ID
     */
    public function getById($id)
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Create new record
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    /**
     * Update record
     */
    public function update($id, array $data)
    {
        $record = $this->getById($id);
        $record->update($data);
        return $record;
    }

    /**
     * Delete record
     */
    public function delete($id)
    {
        return $this->model->destroy($id);
    }

    /**
     * Search records
     */
    public function search($query, $fields = [], $limit = 10)
    {
        $builder = $this->model->newQuery();

        foreach ($fields as $field) {
            $builder->orWhere($field, 'like', "%{$query}%");
        }

        return $builder->paginate($limit);
    }
}
