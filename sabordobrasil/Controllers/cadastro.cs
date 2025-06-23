using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using sabordobrasil.Models;
using System.Linq;
using System.IO;

namespace sabordobrasil.Controllers
{
    [ApiController]
    [Route("api/usuario")]
    public class CadastroController : ControllerBase
    {
        private readonly SabordobrasilContext _context;

        public CadastroController(SabordobrasilContext context)
        {
            _context = context;
        }

        [HttpPost("cadastro")]
        public IActionResult Cadastro([FromForm] UsuarioCadastroDto dto)
        {
            // Exemplo de como salvar a foto (opcional)
            string fotoPath = "/imgs/nonsigneduser.png";
            if (dto.Foto != null && dto.Foto.Length > 0)
            {
                // Salve o arquivo em wwwroot/imgs ou outro local
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Foto.FileName);
                var filePath = Path.Combine("wwwroot/imgs", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    dto.Foto.CopyTo(stream);
                }
                fotoPath = "/imgs/" + fileName;
            }

            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Senha = dto.Senha,
                Foto = fotoPath,
                Adm = false
            };

            _context.Usuarios.Add(usuario);
            _context.SaveChanges();

            return Ok(new { sucesso = true, usuario });
        }
    }

    public class UsuarioCadastroDto
    {
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public IFormFile? Foto { get; set; } // Remova [BindRequired(false)]
    }
}