namespace MeuProjeto.Models
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string? Foto { get; set; }
        public bool? Admin { get; set; }

        public ICollection<Prato> PratosCriados { get; set; }
        public ICollection<Comentario> Comentarios { get; set; }
        public ICollection<Reacao> Reacoes { get; set; }
    }
}