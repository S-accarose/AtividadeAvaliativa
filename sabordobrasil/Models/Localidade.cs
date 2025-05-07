namespace MeuProjeto.Models
{
    public class Localidade
    {
        public int IdLocalidade { get; set; }
        public string Nome { get; set; }

        public ICollection<Prato> Pratos { get; set; }
    }
}