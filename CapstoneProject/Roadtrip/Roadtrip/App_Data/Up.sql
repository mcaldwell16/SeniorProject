
 -- #######################################
-- #             Identity Tables         #
-- #######################################

-- ############# AspNetRoles #############
CREATE TABLE [dbo].[AspNetRoles]
(
    [Id]   NVARCHAR (128) NOT NULL,
    [Name] NVARCHAR (256) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex]
    ON [dbo].[AspNetRoles]([Name] ASC);

-- ############# AspNetUsers #############
CREATE TABLE [dbo].[AspNetUsers]
(
    [Id]                   NVARCHAR (128) NOT NULL,
    [Email]                NVARCHAR (256) NULL,
    [EmailConfirmed]       BIT            NOT NULL,
    [PasswordHash]         NVARCHAR (MAX) NULL,
    [SecurityStamp]        NVARCHAR (MAX) NULL,
    [PhoneNumber]          NVARCHAR (MAX) NULL,
    [PhoneNumberConfirmed] BIT            NOT NULL,
    [TwoFactorEnabled]     BIT            NOT NULL,
    [LockoutEndDateUtc]    DATETIME       NULL,
    [LockoutEnabled]       BIT            NOT NULL,
    [AccessFailedCount]    INT            NOT NULL,
    [UserName]             NVARCHAR (256) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[AspNetUsers]([UserName] ASC);

-- ############# AspNetUserClaims #############
CREATE TABLE [dbo].[AspNetUserClaims]
(
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [UserId]     NVARCHAR (128) NOT NULL,
    [ClaimType]  NVARCHAR (MAX) NULL,
    [ClaimValue] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserClaims]([UserId] ASC);

-- ############# AspNetUserLogins #############
CREATE TABLE [dbo].[AspNetUserLogins]
(
    [LoginProvider] NVARCHAR (128) NOT NULL,
    [ProviderKey]   NVARCHAR (128) NOT NULL,
    [UserId]        NVARCHAR (128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED ([LoginProvider] ASC, [ProviderKey] ASC, [UserId] ASC),
    CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserLogins]([UserId] ASC);

-- ############# AspNetUserRoles #############
CREATE TABLE [dbo].[AspNetUserRoles]
(
    [UserId] NVARCHAR (128) NOT NULL,
    [RoleId] NVARCHAR (128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC),
    CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserRoles]([UserId] ASC);
GO
CREATE NONCLUSTERED INDEX [IX_RoleId] ON [dbo].[AspNetUserRoles]([RoleId] ASC);

CREATE TABLE [dbo].[SavedRoutes]
(
    [SRID]         INT IDENTITY (1,1) NOT NULL,
    [Route]        NVARCHAR (MAX) NOT NULL,
    [Timestamp]    DATETIME       NOT NULL,
    [Username]     NVARCHAR (256) NOT NULL,
	[RouteName]	   NVARCHAR (256) NOT NULL, 
	[Tag1]		   NVARCHAR (256) NOT NULL, 
	[Tag2]		   NVARCHAR (256) NOT NULL 
    CONSTRAINT [PK_dbo.SavedRoutes] PRIMARY KEY CLUSTERED ([SRID] ASC)
);
GO

CREATE TABLE [dbo].[Comments]
(
    [CommentID] INT IDENTITY (1,1) NOT NULL,
    [EstablishmentID] NVARCHAR (MAX) NOT NULL,
    [Comment] NVARCHAR (MAX) NOT NULL,
    [UserName] NVARCHAR (MAX) NOT NULL,
    [DateS] NVARCHAR (MAX),
    CONSTRAINT [PK_dbo.Comments] PRIMARY KEY CLUSTERED ([CommentID] ASC)
);


CREATE TABLE [dbo].[LikedRoutes]
(
[LRID]			INT IDENTITY (1,1) NOT NULL,
[UserName]		NVARCHAR (256) NOT NULL,
[RouteID]		INT NOT NULL 
CONSTRAINT [PK_dbo.LikedRoutes] PRIMARY KEY CLUSTERED ([LRID] ASC)
);
GO

CREATE TABLE [dbo].[Profile]
(
[PPID]			INT IDENTITY (1,1) NOT NULL,
[UserName]		NVARCHAR (256) NOT NULL,
[AboutMe]		NVARCHAR (501) NOT NULL,
[PrivacyFlag]   NVARCHAR (20) NOT NULL,
[Follower] varchar(MAX) NOT NULL,
[Following] varchar(MAX) NOT NULL,
[PendingRequests] varchar(MAX) NOT NULL,
[RequestsPending] varchar(MAX) NOT NULL,
[PicLink] varchar(50) NOT NULL,
[Comments] varchar(MAX) NOT NULL,
CONSTRAINT [PK_dbo.Profile] PRIMARY KEY CLUSTERED ([PPID] ASC)
);


CREATE TABLE [dbo].[Events]
(
[EID] INT IDENTITY (1,1) NOT NULL,
[EventName] NVARCHAR (MAX) NOT NULL,
[Route] NVARCHAR (MAX) NOT NULL,
[Start] DATETIME NOT NULL,
[Finish] DATETIME NOT NULL,
CONSTRAINT [PK_dbo.Events] PRIMARY KEY CLUSTERED ([EID] ASC)
);

GO

CREATE TABLE [dbo].[Attendants]
(
[AID] INT IDENTITY (1,1) NOT NULL,
[UserID] INT NOT NULL,
[EventID] INT NOT NULL,
CONSTRAINT [PK_dbo.Attendants] PRIMARY KEY CLUSTERED ([AID] ASC),
CONSTRAINT [FK_dbo.Attendants_dbo.Profile_PPID] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Profile] ([PPID]) ON DELETE CASCADE,
CONSTRAINT [FK_dbo.Attendants_dbo.Events_EID] FOREIGN KEY ([EventID]) REFERENCES [dbo].[Events] ([EID]) ON DELETE CASCADE
);


CREATE TABLE [dbo].[LikedEstablishments]
(
[LEID]			INT IDENTity (1,1) NOT NULL, 
[EstablishmentID] NVARCHAR (MAX) NOT NULL, 
[UserName]		NVARCHAR (256), 
[EstablishmentName] NVARCHAR (MAX)
CONSTRAINT [PK_dbo.LikedEstablishments] PRIMARY KEY CLUSTERED ([LEID] ASC)
);
GO

