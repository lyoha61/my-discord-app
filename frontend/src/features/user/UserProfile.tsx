import SettingsIcon from '../../assets/icons/settings.png';
import DndIcon from '../../assets/icons/dnd.png';
import SignOutIcon from '../../assets/icons/sign-out.png';
import { useEffect, useState } from 'react';
import type { User } from 'shared/types/user';
import { getMe } from 'src/services/userService';
import { logout } from 'src/services/authService';
import { useNavigate } from 'react-router-dom';

export const UserProfile: React.FC = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		const fetchUserProfile = async() => {
			const data = await getMe();
			setUser(data.user);
		}

		fetchUserProfile().catch(err => console.error(err));
	}, [])

	if(!user) return;

	return (
		<div className="border-t border-[#393939] p-4 pr-6">
			<div className="flex gap-4">
				<div className="flex items-center justify-center">
					{
						user.avatar?.url 
						? <img 
								className='w-12 aspect-square rounded-full  object-cover'
								src={user.avatar?.url}
							/> 
							: 'AB'
						}
				</div>
				<div className="flex flex-col">
					<span className="font-semibold">{user.username}</span>
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 rounded-full bg-[#5CB85C]"></div>
						{/* <span className="text-sm">{isOnline ? "Online" : "Offline"}</span> */}
						<span className='text-sm'>Online</span>
					</div>
				</div>
				<div className='flex flex-1 gap-2.5 items-center justify-end'>
					<img className="cursor-pointer h-4" src={DndIcon} alt="" />
					<img 
						className='cursor-pointer h-4' 
						src={SettingsIcon} 
						alt="Иконка настройки" 
						onClick={() => void navigate('/profile/settings')}
					/>

					<img 
						className='cursor-pointer h-4.5' 
						src={SignOutIcon} 
						alt="" 
						onClick={() => void logout()}
					/>
					
				</div>
			</div>
		</div>
	)
}