<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'admin') {
            $contacts = User::where('role', '!=', 'admin')->get();
            return Inertia::render('Admin/Messages', [
                'contacts' => $contacts
            ]);
        }
        
        if ($user->role === 'rider') {
            $contacts = User::whereIn('role', ['admin', 'customer'])->get();
            return Inertia::render('Rider/Messages', [
                'contacts' => $contacts
            ]);
        }

        // Customer
        $contacts = User::whereIn('role', ['admin', 'rider'])->get();
        return Inertia::render('Customer/Messages', [ // Or just throw to a generic page if customer UI isn't ready
            'contacts' => $contacts
        ]);
    }

    public function fetchMessages(Request $request, $contactId)
    {
        $userId = $request->user()->id;
        
        // Mark messages from this contact as read
        Message::where('sender_id', $contactId)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = Message::with('sender')
            ->where(function($q) use ($userId, $contactId) {
                $q->where('sender_id', $userId)->where('receiver_id', $contactId);
            })
            ->orWhere(function($q) use ($userId, $contactId) {
                $q->where('sender_id', $contactId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json($message->load('sender'));
    }

    public function unreadCount(Request $request)
    {
        $count = Message::where('receiver_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }
}
