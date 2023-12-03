import moment from 'moment';

export function dateFormatEurope(date: Date) {
	return moment(date).format('DD/MM/YYYY, HH:mm');
}
