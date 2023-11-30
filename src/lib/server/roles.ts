export enum Roles {
	User = 1 << 0,
	Approver = 1 << 1,
	Moderator = 1 << 2,
	Admin = 1 << 3,
	Owner = 1 << 4
}

export const RoleNameMap = Object.freeze({
	[Roles.Approver]: {
		priority: 1,
		label: 'Approver',
		materialIcon: 'check_circle'
	},
	[Roles.Moderator]: {
		priority: 2,
		label: 'Moderator',
		materialIcon: 'security'
	},
	[Roles.Admin]: {
		priority: 99,
		label: 'Admin',
		materialIcon: 'verified_user'
	},
	[Roles.Owner]: {
		priority: 100,
		label: 'Owner',
		materialIcon: 'star'
	}
});

export class RoleUtility {
	static addRole(roles: number, role: Roles): number {
		return roles | role;
	}

	static removeRole(roles: number, role: Roles): number {
		return roles & ~role;
	}

	static hasRole(roles: number, role: Roles): boolean {
		return (roles & role) === role;
	}

	static getAllRoles(roles: number): Roles[] {
		return Object.keys(Roles)
			.filter((key: any) => !isNaN(Number(Roles[key])))
			.map((key: any) => Number(Roles[key]))
			.filter((role) => RoleUtility.hasRole(roles, role));
	}
}
