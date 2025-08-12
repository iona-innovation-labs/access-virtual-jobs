import { relations } from "drizzle-orm/relations";
import { users, account, deleteRequests, session, profiles, assessmentTests, certifications, contentLinks, education, emails, fileUploads, phones, portfolioLinks, skills, workHistory, workSamples, notifications, jobApplications, jobs, userBookmarks } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(account),
	deleteRequests: many(deleteRequests),
	sessions: many(session),
	profiles: many(profiles),
	notifications: many(notifications),
	jobApplications: many(jobApplications),
	jobs: many(jobs),
	userBookmarks: many(userBookmarks),
}));

export const deleteRequestsRelations = relations(deleteRequests, ({one}) => ({
	user: one(users, {
		fields: [deleteRequests.userId],
		references: [users.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	user: one(users, {
		fields: [profiles.userId],
		references: [users.id]
	}),
	assessmentTests: many(assessmentTests),
	certifications: many(certifications),
	contentLinks: many(contentLinks),
	educations: many(education),
	emails: many(emails),
	fileUploads: many(fileUploads),
	phones: many(phones),
	portfolioLinks: many(portfolioLinks),
	skills: many(skills),
	workHistories: many(workHistory),
	workSamples: many(workSamples),
	jobApplications: many(jobApplications),
}));

export const assessmentTestsRelations = relations(assessmentTests, ({one}) => ({
	profile: one(profiles, {
		fields: [assessmentTests.profileId],
		references: [profiles.id]
	}),
}));

export const certificationsRelations = relations(certifications, ({one}) => ({
	profile: one(profiles, {
		fields: [certifications.profileId],
		references: [profiles.id]
	}),
}));

export const contentLinksRelations = relations(contentLinks, ({one}) => ({
	profile: one(profiles, {
		fields: [contentLinks.profileId],
		references: [profiles.id]
	}),
}));

export const educationRelations = relations(education, ({one}) => ({
	profile: one(profiles, {
		fields: [education.profileId],
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

export const portfolioLinksRelations = relations(portfolioLinks, ({one}) => ({
	profile: one(profiles, {
		fields: [portfolioLinks.profileId],
		references: [profiles.id]
	}),
}));

export const skillsRelations = relations(skills, ({one}) => ({
	profile: one(profiles, {
		fields: [skills.profileId],
		references: [profiles.id]
	}),
}));

export const workHistoryRelations = relations(workHistory, ({one}) => ({
	profile: one(profiles, {
		fields: [workHistory.profileId],
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

export const jobApplicationsRelations = relations(jobApplications, ({one}) => ({
	user: one(users, {
		fields: [jobApplications.userId],
		references: [users.id]
	}),
	profile: one(profiles, {
		fields: [jobApplications.profileId],
		references: [profiles.id]
	}),
	job: one(jobs, {
		fields: [jobApplications.jobId],
		references: [jobs.id]
	}),
}));

export const jobsRelations = relations(jobs, ({one, many}) => ({
	jobApplications: many(jobApplications),
	user: one(users, {
		fields: [jobs.postedById],
		references: [users.id]
	}),
	userBookmarks: many(userBookmarks),
}));

export const userBookmarksRelations = relations(userBookmarks, ({one}) => ({
	user: one(users, {
		fields: [userBookmarks.userId],
		references: [users.id]
	}),
	job: one(jobs, {
		fields: [userBookmarks.jobId],
		references: [jobs.id]
	}),
}));