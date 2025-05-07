using Microsoft.EntityFrameworkCore;
using MeuProjeto.Models;

namespace MeuProjeto.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Localidade> Localidades { get; set; }
        public DbSet<Prato> Pratos { get; set; }
        public DbSet<Comentario> Comentarios { get; set; }
        public DbSet<Reacao> Reacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Reacao>().HasIndex(r => new { r.IdUsuario, r.IdPrato }).IsUnique();

            modelBuilder.Entity<Prato>()
                .HasOne(p => p.UsuarioCriador)
                .WithMany(u => u.PratosCriados)
                .HasForeignKey(p => p.CriadoPor);

            modelBuilder.Entity<Prato>()
                .HasOne(p => p.Localidade)
                .WithMany(l => l.Pratos)
                .HasForeignKey(p => p.IdLocalidade);

            modelBuilder.Entity<Comentario>()
                .HasOne(c => c.Usuario)
                .WithMany(u => u.Comentarios)
                .HasForeignKey(c => c.IdUsuario);

            modelBuilder.Entity<Comentario>()
                .HasOne(c => c.Prato)
                .WithMany(p => p.Comentarios)
                .HasForeignKey(c => c.IdPrato);

            modelBuilder.Entity<Reacao>()
                .HasOne(r => r.Usuario)
                .WithMany(u => u.Reacoes)
                .HasForeignKey(r => r.IdUsuario);

            modelBuilder.Entity<Reacao>()
                .HasOne(r => r.Prato)
                .WithMany(p => p.Reacoes)
                .HasForeignKey(r => r.IdPrato);
        }
    }
}