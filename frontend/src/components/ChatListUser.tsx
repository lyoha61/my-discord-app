import type { MemberPrivateChat } from "shared/types/chat"

export const ChatListUser: React.FC<{ member: MemberPrivateChat }> = ({member}) => {

	return (
		<div className="bg-[#2A2A2A] h-20 border-l border-[#4A90E2] pl-4 flex items-center gap-4">
			<div className="w-16 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
				AB
			</div>

			<div className="block flex flex-col text-sm w-full gap-0.5">
				<span className="font-semibold">{member.username}</span>
				<span className="text-gray-500">Последние сообщение...</span>
			</div>

		</div>
	)
}