namespace DAL.Models
{
    public class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int MedicineId { get; set; }
        public virtual Medicine Medicine { get; set; }
    }
}
