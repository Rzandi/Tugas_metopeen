<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAdminRegistration extends Notification
{
    use Queueable;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Admin Registration Request')
            ->line('A new user has registered as Admin: ' . $this->user->name)
            ->action('Approve User', url('/')) // In real app, link to dashboard
            ->line('Please login to the dashboard to approve or reject.');
    }
}
