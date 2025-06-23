using Microsoft.AspNetCore.Mvc;
using sabordobrasil.Models;
using System.Linq;

namespace sabordobrasil.Controllers
{
    [ApiController]
    [Route("api/usuario")]
    public class LoginController : ControllerBase
    {
        private readonly SabordobrasilContext _context;

        public LoginController(SabordobrasilContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UsuarioLoginDto dto)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == dto.Email && u.Senha == dto.Senha);
            if (usuario == null)
                return Ok(new { sucesso = false, mensagem = "Email ou senha incorretos!" });

            return Ok(new { sucesso = true, usuario });
        }
    }

    // DTO para login
    public class UsuarioLoginDto
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }
}