import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  MoreHorizontal, 
  Send, 
  Star, 
  ThumbsUp, 
  UserPlus 
} from 'lucide-react';

/**
 * NotificationIcon component provides the appropriate icon based on notification type
 * 
 * @param type - The type of notification
 * @returns React element with the appropriate icon
 */
const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-white" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-white" />;
    case 'like':
      return <ThumbsUp className="h-4 w-4 text-white" />;
    case 'feature':
      return <Star className="h-4 w-4 text-white" />;
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-white" />;
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-white" />;
    case 'message':
      return <Send className="h-4 w-4 text-white" />;
    default:
      return <MoreHorizontal className="h-4 w-4 text-white" />;
  }
};

export default NotificationIcon; 