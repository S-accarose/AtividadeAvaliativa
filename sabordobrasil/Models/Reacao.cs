namespace MeuProjeto.Models
{
    public class Reacao
    {
        public int IdReacao { get; set; }
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public int IdPrato { get; set; }
        public Prato Prato { get; set; }

        public string Tipo { get; set; } // like ou deslike
        public DateTime? DataReacao { get; set; }
    }
}