using Microsoft.EntityFrameworkCore.Migrations;
using System.Text;

namespace Hashgard.Back.Db.Migrations
{
    public partial class RemoveCompositeForCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sql = new StringBuilder();
            
            sql.AppendLine("update a");
            sql.AppendLine("set a.CategoryId = pa.Id");
            sql.AppendLine("from articles a");
            sql.AppendLine("inner join categories ch on a.CategoryId = ch.Id");
            sql.AppendLine("inner join categories pa on ch.CategoryId = pa.Id;");

            sql.AppendLine("delete from Categories");
            sql.AppendLine("where CategoryId is not null;");

            migrationBuilder.Sql(sql.ToString());


            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_CategoryId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_CategoryId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Categories");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CategoryId",
                table: "Categories",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_CategoryId",
                table: "Categories",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_CategoryId",
                table: "Categories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
