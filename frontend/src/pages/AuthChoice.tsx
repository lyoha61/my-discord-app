import { useNavigate } from "react-router-dom"
import UserPlusIcon from "assets/icons/user-plus.svg?react";
import LoginIcon from "assets/icons/login.svg?react";
import LogoIcon from "assets/logo.svg?react";
import LogoTextIcon from "assets/logo-text.svg?react";


const AuthChoice: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="flex justify-center items-center bg-[#ffffff] h-full w-full text-[#111827]">
      <div className="w-[30%] flex flex-col">
        <div className="flex flex-col gap-1 text-center items-center">
          <div className="w-[70px] h-[70px] bg-[#1F2937] rounded-xl mb-2">
            <LogoIcon className="py-2 w-full h-full text-[#ffffff] fill-current " />
          </div>
          <h1 className="font-bold text-2xl">Добро пожаловать в</h1>
          <div className="flex items-center justify-center h-[50px] w-full">
            <LogoTextIcon className="w-[100px] h-auto" />
          </div>

        </div>

        <div className="flex flex-col gap-3 mt-5 mb-7">
          <span className="text-sm text-center">Выберите способ авторизации</span>
          <div className="bg-[#111827] text-[#ffffff] rounded-[7px]">
            <button
              className="flex items-center justify-center gap-2 w-full h-full cursor-pointer py-2.5"
              onClick={() => navigate("/login")}
            >
              <LoginIcon className="text-[#ffffff] fill-current w-5" />
              Войти в аккаунт
            </button>
          </div>

          <div className="border-2 border-[#D1D5DB] rounded-[7px]">
            <button
              className="flex gap-2 items-center justify-center w-full h-full cursor-pointer py-2.5"
              onClick={() => navigate("/register")}
            >
              <UserPlusIcon className='w-5' />
              Создать аккаунт
            </button>
          </div>
        </div>

        <div className="text-center text-sm w-full text-[#6B7280]">
          <span className="">
            Продолжая, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности
          </span>
        </div>

      </div>
    </div>
  );
}

export default AuthChoice;