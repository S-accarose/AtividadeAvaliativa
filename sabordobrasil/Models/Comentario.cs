namespace MeuProjeto.Models
{
    public class Comentario
    {
        public int IdComentario { get; set; }
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public int IdPrato { get; set; }
        public Prato Prato { get; set; }

        public string Texto { get; set; }
        public DateTime? DataComentario { get; set; }
    }
}