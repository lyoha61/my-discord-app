import { useEffect, useState } from "react"
import type { User } from "shared/types/user"
import { UserCard } from "src/components/UI/UserCard"
import { getCurrentUserId } from "src/services/authService"
import { getMembersPrivateChat } from "src/services/chatService"
import CallIcon from "assets/icons/call.png"
import VideoCallIcon from "assets/icons/video-call.png"

export const ChatHeader: React.FC<{chatId: string}> = ({ chatId }) => {
	const currentUserId = getCurrentUserId();
	const [memberChat, setMemberChat] = useState<User | null>(null);

	useEffect(() => {
		const fetchMembers = async (chatId: string) => {
			try {
				const membersRes = await getMembersPrivateChat(chatId);
				const members = membersRes.users;
				const member = members.find((member) => member.id !== currentUserId) || null
				setMemberChat(member);
				return;
			} catch (err) {
				console.error(err);
			}
		}
		if (!chatId) return;

		fetchMembers(chatId).catch(err => console.error(err));
	}, [chatId, currentUserId])

	if (!memberChat) return;

	return (
		<div className="flex items-center justify-between bg-[#1A1A1A] border border-[#393939] border-l-0">
			<UserCard 
				member={memberChat} 
				variant="header"
				onClick={() => {}}
				isSelected={false}
			/>
			<div className="flex item-center  gap-8 pr-5">
				<img className="h-[17px]" src={CallIcon} alt="" /> 
				<img className="h-[20px]" src={VideoCallIcon} alt="" /> 
			</div>
		</div>
	)
}