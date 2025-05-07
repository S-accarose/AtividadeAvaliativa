namespace MeuProjeto.Models
{
    public class Prato
    {
        public int IdPrato { get; set; }
        public string Nome { get; set; }
        public string? Descricao { get; set; }
        public string? Foto { get; set; }

        public int? IdLocalidade { get; set; }
        public Localidade? Localidade { get; set; }

        public int CriadoPor { get; set; }
        public Usuario UsuarioCriador { get; set; }

        public ICollection<Comentario> Comentarios { get; set; }
        public ICollection<Reacao> Reacoes { get; set; }
    }
}