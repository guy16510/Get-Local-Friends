import React from 'react';

interface ConversationListProps {
  conversations: any[];
  onSelect: (conversation: any) => void;
  currentUser: { id: string };
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, onSelect, currentUser }) => {
  return (
    <div className="w-1/3 bg-white p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>
      <ul>
        {conversations.map((conversation) => {
          const otherUser =
            conversation.user1Id === currentUser.id
              ? conversation.user2Id
              : conversation.user1Id;

          return (
            <li
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              className="p-2 cursor-pointer hover:bg-gray-200 rounded"
            >
              Chat with: <strong>{otherUser}</strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ConversationList;