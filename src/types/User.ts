export type TUser = {
	id: number;
	name: string;
	company: string;
	email: string;
	password: string;
	lastSeen: string;
	status: "blocked" | "ok";
};
