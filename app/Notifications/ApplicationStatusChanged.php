<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationStatusChanged extends Notification
{
    use Queueable;

    public $application;
    public $message;

    /**
     * Create a new notification instance.
     */
    public function __construct(\App\Models\Application $application, $message = null)
    {
        $this->application = $application;
        $this->message = $message ?: "Your application for {$application->scholarship->title} has a status update: {$application->status}.";
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'scholarship_title' => $this->application->scholarship->title,
            'status' => $this->application->status,
            'message' => $this->message,
        ];
    }
}
