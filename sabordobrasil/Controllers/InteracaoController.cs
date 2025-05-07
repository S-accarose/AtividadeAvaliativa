using Microsoft.AspNetCore.Mvc;
using MeuProjeto.Data;
using MeuProjeto.Models;

[ApiController]
[Route("")]
public class InteracaoController : ControllerBase
{
    private readonly AppDbContext _context;

    public InteracaoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("comentar")]
    public IActionResult Comentar([FromBody] ComentarioDTO comentarioDto)
    {
        var comentario = new Comentario
        {
            IdUsuario = comentarioDto.Usuario_Id,
            IdPrato = comentarioDto.Post_Id,
            Texto = comentarioDto.Comentario,
            DataComentario = DateTime.Now
        };

        _context.Comentarios.Add(comentario);
        _context.SaveChanges();

        return Ok(new { sucesso = true });
    }

    [HttpPost("like")]
    public IActionResult Like([FromBody] ReacaoDTO dto)
    {
        return RegistrarReacao(dto, "like");
    }

    [HttpPost("deslike")]
    public IActionResult Deslike([FromBody] ReacaoDTO dto)
    {
        return RegistrarReacao(dto, "deslike");
    }

    private IActionResult RegistrarReacao(ReacaoDTO dto, string tipo)
    {
        var reacaoExistente = _context.Reacoes
            .FirstOrDefault(r => r.IdUsuario == dto.Usuario_Id && r.IdPrato == dto.Post_Id);

        if (reacaoExistente != null)
        {
            reacaoExistente.Tipo = tipo;
            reacaoExistente.DataReacao = DateTime.Now;
        }
        else
        {
            _context.Reacoes.Add(new Reacao
            {
                IdUsuario = dto.Usuario_Id,
                IdPrato = dto.Post_Id,
                Tipo = tipo,
                DataReacao = DateTime.Now
            });
        }

        _context.SaveChanges();
        return Ok(new { sucesso = true });
    }

    public class ComentarioDTO
    {
        public int Usuario_Id { get; set; }
        public int Post_Id { get; set; } // Nome genérico usado no JS
        public string Comentario { get; set; }
    }

    public class ReacaoDTO
    {
        public int Usuario_Id { get; set; }
        public int Post_Id { get; set; }
    }
}