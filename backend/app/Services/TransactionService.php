<?php

namespace App\Services;

use App\Models\Transaction;
use Carbon\Carbon;

/**
 * Transaction Service
 * Handles business logic for transactions
 */
class TransactionService extends BaseService
{
    protected function getModel()
    {
        return new Transaction();
    }

    /**
     * Get transaction statistics
     */
    public function getStatistics($startDate = null, $endDate = null)
    {
        $query = $this->model;

        if ($startDate) {
            $query = $query->where('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query = $query->where('created_at', '<=', $endDate);
        }

        $totalSales = $query->where('type', 'sale')->sum('amount');
        $totalExpenses = $query->where('type', 'expense')->sum('amount');
        $totalRestocks = $query->where('type', 'restock')->count();

        return [
            'total_sales' => $totalSales,
            'total_expenses' => $totalExpenses,
            'net_profit' => $totalSales - $totalExpenses,
            'total_restocks' => $totalRestocks,
            'count' => $query->count(),
        ];
    }

    /**
     * Get daily statistics
     */
    public function getDailyStatistics($date = null)
    {
        $date = $date ? Carbon::parse($date) : Carbon::today();

        return $this->model
            ->whereDate('created_at', $date)
            ->selectRaw('type, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('type')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => $item->type,
                    'count' => $item->count,
                    'total' => $item->total,
                ];
            });
    }

    /**
     * Get monthly report
     */
    public function getMonthlyReport($month = null, $year = null)
    {
        $month = $month ?? Carbon::now()->month;
        $year = $year ?? Carbon::now()->year;

        return $this->model
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->selectRaw('DATE(created_at) as date, type, SUM(amount) as total, COUNT(*) as count')
            ->groupByRaw('DATE(created_at), type')
            ->orderBy('date')
            ->get();
    }
}
