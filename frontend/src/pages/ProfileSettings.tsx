import { useEffect, useRef, useState } from "react";
import type { EditableAvatar, User } from "shared/types/user";
import { getCurrentUserId } from "src/services/authService"
import { getUser, updateMyProfileFormData } from "src/services/userService";

export const ProfileSettings = () => {
	const currentUserId = getCurrentUserId();
	const [user, setUser] = useState<User | null>(null);
	const [editedUser, setEditedUser] = useState<EditableAvatar>({});
	const [isEditing, setIsEditing] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const selectAvaInput = useRef<HTMLInputElement | null>(null);

	const avatarUrl: string = editedUser.avatar?.url ?? user?.avatar?.url ?? '/src/assets/default-user-ava.png';

	useEffect(() => {
		if (!currentUserId) return;
		const fetchUserData = async () => {
			try {
				const userData = await getUser(currentUserId);
				setUser(userData.user);
			} catch (err) {
				console.error(err);
			}
		};
		fetchUserData().catch(err => console.error(err));
	}, [currentUserId]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);
			setEditedUser(prev => {
				console.log(prev);
				return {
					...prev,
					avatar: {id: prev.avatar?.id, url: URL.createObjectURL(selectedFile)}
				}
			});

			setIsEditing(true)
		}
	}

	const handleSelectAvatar = () => {
		selectAvaInput.current?.click();
	}

	const handleSave = async () => {
		if (!user) return;
		const formData = new FormData();
		Object.entries(editedUser).forEach(([key, value]) => {
			if (value !== undefined) formData.append(key, value as string);
		})

		if (file) formData.append('avatar', file);
		
		const updatedUser = await updateMyProfileFormData(formData);
		console.log(updatedUser);
	}

	return (
		<div className="flex justify-center items-center max-w-full max-h-full h-full w-full text-[#111827] bg-[#F9FAFB]">
			<div className="bg-[#ffffff] shadow p-4 rounded-2xl h-[80%] w-[50%]">

				<div className="flex items-center gap-5 mt-7 mb-5">
					<img 
						src={avatarUrl} 
						alt="" 
						className="w-17 aspect-square rounded-full shadow-down-light cursor-pointer object-cover"
						onClick={() => handleSelectAvatar()}
					/>
					<input 
						type="file"
						ref={selectAvaInput}
						className="hidden"
						onChange={handleFileChange}
					/>
					<div className="flex flex-col">
						<label htmlFor="username">Username</label>
						<input 
							value={user?.username} 
							name="username"
							id="username"
							className="border-[#D1D5DB] border-1 py-3 px-3 rounded-xl w-[70%]" 
						/>
					</div>
				</div>

				<div className="flex justify-end gap-4">
					<button 
						className="bg-[#111827] text-[#ffffff] py-3 px-2 rounded-2xl w-[40%] text-xs font-semibold cursor-pointer"
						onClick={() => void handleSave()}
					>
						Сохранить
					</button>
					<button className="border-1 border-[#D1D5DB] rounded-xl py-2 px-5 cursor-pointer"
					>
						Отмена
					</button>
				</div>

			</div>
		</div>
	)
}