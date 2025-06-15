import { relations } from "drizzle-orm/relations";
import { users, session, profiles, assessmentTests, contentLinks, emails, fileUploads, phones, workSamples, notifications, account, jobApplications } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(session),
	notifications: many(notifications),
	profiles: many(profiles),
	accounts: many(account),
	jobApplications: many(jobApplications),
}));

export const assessmentTestsRelations = relations(assessmentTests, ({one}) => ({
	profile: one(profiles, {
		fields: [assessmentTests.profileId],
		references: [profiles.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	assessmentTests: many(assessmentTests),
	contentLinks: many(contentLinks),
	emails: many(emails),
	fileUploads: many(fileUploads),
	phones: many(phones),
	workSamples: many(workSamples),
	user: one(users, {
		fields: [profiles.userId],
		references: [users.id]
	}),
	jobApplications: many(jobApplications),
}));

export const contentLinksRelations = relations(contentLinks, ({one}) => ({
	profile: one(profiles, {
		fields: [contentLinks.profileId],
		references: [profiles.id]
	}),
}));

export const emailsRelations = relations(emails, ({one}) => ({
	profile: one(profiles, {
		fields: [emails.profileId],
		references: [profiles.id]
	}),
}));

export const fileUploadsRelations = relations(fileUploads, ({one}) => ({
	profile: one(profiles, {
		fields: [fileUploads.profileId],
		references: [profiles.id]
	}),
}));

export const phonesRelations = relations(phones, ({one}) => ({
	profile: one(profiles, {
		fields: [phones.profileId],
		references: [profiles.id]
	}),
}));

export const workSamplesRelations = relations(workSamples, ({one}) => ({
	profile: one(profiles, {
		fields: [workSamples.profileId],
		references: [profiles.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));

export const jobApplicationsRelations = relations(jobApplications, ({one}) => ({
	user: one(users, {
		fields: [jobApplications.userId],
		references: [users.id]
	}),
	profile: one(profiles, {
		fields: [jobApplications.profileId],
		references: [profiles.id]
	}),
}));