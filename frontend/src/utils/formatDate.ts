export const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		const today = new Date();
		const options: Intl.DateTimeFormatOptions = {
			day: 'numeric',
			month: 'long'
		}

		const isToday = 
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear();
		
		if (isToday) return 'Сегодня'
		
		if (date.getFullYear() !== today.getFullYear()) {
			options.year = 'numeric'
		}

		return date.toLocaleDateString('ru-RU', options);
	}