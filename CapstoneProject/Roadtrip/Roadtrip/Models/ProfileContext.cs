namespace Roadtrip.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using Roadtrip.DAL;

    public partial class ProfileContext : DbContext
    {
        public ProfileContext()
            : base("name=SavedContext")
        {
        }

        public virtual DbSet<LikedRoute> LikedRoutes { get; set; }
        public virtual DbSet<Profile> Profiles { get; set; }
        public virtual DbSet<SavedRoute> SavedRoutes { get; set; }
        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<Attendant> Attendant { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Profile>()
                .HasMany(e => e.Attendants)
                .WithRequired(e => e.Profile)
                .HasForeignKey(e => e.UserID)
                .WillCascadeOnDelete();

            modelBuilder.Entity<Event>()
               .HasMany(e => e.Attendants)
               .WithRequired(e => e.Event)
               .HasForeignKey(e => e.EventID)
               .WillCascadeOnDelete();
        }
    }
}
