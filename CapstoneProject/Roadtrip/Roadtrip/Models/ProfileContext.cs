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
            : base("name=BradLocal")
        {
        }

        public virtual DbSet<LikedRoute> LikedRoutes { get; set; }
        public virtual DbSet<Profile> Profiles { get; set; }
        public virtual DbSet<SavedRoute> SavedRoutes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
