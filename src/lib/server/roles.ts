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
		materialIcon: 'check_circle',
		description:
			'This user can review bots to ensure they meet the requirements to be listed on the site.'
	},
	[Roles.Moderator]: {
		priority: 2,
		label: 'Moderator',
		materialIcon: 'security',
		description: 'This user can moderate the site and Discord server.'
	},
	[Roles.Admin]: {
		priority: 99,
		label: 'Admin',
		materialIcon: 'verified_user',
		description: 'This user can manage the site and Discord server.'
	},
	[Roles.Owner]: {
		priority: 100,
		label: 'Owner',
		materialIcon: 'star',
		description: 'This user owns the site.'
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
