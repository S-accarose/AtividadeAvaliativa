using Microsoft.AspNetCore.Mvc;
using MeuProjeto.Data;
using MeuProjeto.Models;

[ApiController]
[Route("")]
public class UsuarioController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuarioController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("cadastro")]
    public IActionResult Cadastrar([FromBody] Usuario usuario)
    {
        if (_context.Usuarios.Any(u => u.Email == usuario.Email))
            return BadRequest(new { sucesso = false, mensagem = "Email já cadastrado." });

        _context.Usuarios.Add(usuario);
        _context.SaveChanges();

        return Ok(new { sucesso = true });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO login)
    {
        var usuario = _context.Usuarios
            .FirstOrDefault(u => u.Email == login.Email && u.Senha == login.Senha);

        if (usuario == null)
            return Unauthorized(new { sucesso = false, mensagem = "Email ou senha incorretos." });

        return Ok(new { sucesso = true, usuario });
    }

    public class LoginDTO
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }
}