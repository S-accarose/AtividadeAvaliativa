using Microsoft.EntityFrameworkCore;
using sabordobrasil.Models;

namespace sabordobrasil.Data
{
    public class SabordobrasilContext : DbContext
    {
        public SabordobrasilContext(DbContextOptions<SabordobrasilContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Prato> Pratos { get; set; }
        public DbSet<Comentario> Comentarios { get; set; }
        public DbSet<Reacao> Reacoes { get; set; }
    }
}