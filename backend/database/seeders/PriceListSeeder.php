<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PriceList;

class PriceListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Frozen Food
            ['product_id' => 'MD001', 'category' => 'Frozen Food', 'product_name' => 'Mozarella Saputo 250 Gr', 'unit' => 'Pack', 'price' => 26320],
            ['product_id' => 'MD004', 'category' => 'Frozen Food', 'product_name' => 'Iga Sapi', 'unit' => 'Kg', 'price' => 100000],
            ['product_id' => 'MD0048', 'category' => 'Frozen Food', 'product_name' => 'Mozarella Oldenburger 1Kg', 'unit' => 'Pack', 'price' => 105260],
            ['product_id' => 'MD0050', 'category' => 'Frozen Food', 'product_name' => 'Shoestring Golden 2Kg', 'unit' => 'Pack', 'price' => 54740],
            ['product_id' => 'MD0052', 'category' => 'Frozen Food', 'product_name' => 'Jamur Enoki', 'unit' => 'Pack', 'price' => 2840],
            ['product_id' => 'MD0078', 'category' => 'Frozen Food', 'product_name' => 'Aice Vanila', 'unit' => 'Pail', 'price' => 157890],
            ['product_id' => 'MD0079', 'category' => 'Frozen Food', 'product_name' => 'Aice Coklat', 'unit' => 'Pail', 'price' => 157890],
            ['product_id' => 'MD0080', 'category' => 'Frozen Food', 'product_name' => 'Aice Strawbery', 'unit' => 'Pail', 'price' => 157890],
            ['product_id' => 'MD0081', 'category' => 'Frozen Food', 'product_name' => 'Rich Gold', 'unit' => 'Pack', 'price' => 58950],
            ['product_id' => 'MD0082', 'category' => 'Frozen Food', 'product_name' => 'Marquise Straigh Cut', 'unit' => 'Pack', 'price' => 30530],
            ['product_id' => 'MD0083', 'category' => 'Frozen Food', 'product_name' => 'Champ Nuget 1 Kg', 'unit' => 'Pack', 'price' => 47370],
            ['product_id' => 'MD0084', 'category' => 'Frozen Food', 'product_name' => 'Bakso Salam', 'unit' => 'Pack', 'price' => 17370],
            ['product_id' => 'MD0085', 'category' => 'Frozen Food', 'product_name' => 'Golden Phoenix Shoestring 2 Kg', 'unit' => 'Pack', 'price' => 54740],
            ['product_id' => 'MD0086', 'category' => 'Frozen Food', 'product_name' => 'Snovely Shoestring 2 Kg', 'unit' => 'Pack', 'price' => 61050],
            ['product_id' => 'MD0096', 'category' => 'Frozen Food', 'product_name' => 'Shortplate', 'unit' => 'Pack', 'price' => 21840],
            ['product_id' => 'MD0097', 'category' => 'Frozen Food', 'product_name' => 'Arla Mozarella', 'unit' => 'Kg', 'price' => 105260],
            ['product_id' => 'MD00100', 'category' => 'Frozen Food', 'product_name' => 'Mix Vegetable 4 Way', 'unit' => 'Pack', 'price' => 25260],
            ['product_id' => 'MD00109', 'category' => 'Frozen Food', 'product_name' => 'Elprimo Beef Cheese Sausage', 'unit' => 'Pack', 'price' => 58420],
            ['product_id' => 'MD00116', 'category' => 'Frozen Food', 'product_name' => 'Mix Vegetable 3 W', 'unit' => 'Pack', 'price' => 18950],
            ['product_id' => 'MD00119', 'category' => 'Frozen Food', 'product_name' => 'Snovely Straigt Cut', 'unit' => 'Pack', 'price' => 62110],

            // Dry Goods
            ['product_id' => 'MD002', 'category' => 'Dry Goods', 'product_name' => 'Kopi Robusta', 'unit' => 'Kg', 'price' => 68420],
            ['product_id' => 'MD005', 'category' => 'Dry Goods', 'product_name' => 'Sedotan Steril Bungkus Krts', 'unit' => 'Pack', 'price' => 21050],
            ['product_id' => 'MD0022', 'category' => 'Dry Goods', 'product_name' => 'Abc Sambal Jerigen 5,5 Kg', 'unit' => 'Jerigen', 'price' => 105260],
            ['product_id' => 'MD0023', 'category' => 'Dry Goods', 'product_name' => 'Abc Tomat Jerigen 5,7Kg', 'unit' => 'Jerigen', 'price' => 84210],
            ['product_id' => 'MD0024', 'category' => 'Dry Goods', 'product_name' => 'Abc Kecap Manis 6Kg', 'unit' => 'Jerigen', 'price' => 136840],
            ['product_id' => 'MD0025', 'category' => 'Dry Goods', 'product_name' => 'Delmonte Extra Hot 5,5Kg', 'unit' => 'Jerigen', 'price' => 103160],
            ['product_id' => 'MD0026', 'category' => 'Dry Goods', 'product_name' => 'Delmonte Tomat 5,7Kg', 'unit' => 'Jerigen', 'price' => 84210],
            ['product_id' => 'MD0031', 'category' => 'Dry Goods', 'product_name' => 'Mosa Soda Charger', 'unit' => 'Pack', 'price' => 73680],
            ['product_id' => 'MD0032', 'category' => 'Dry Goods', 'product_name' => 'Royco Ayam 1Kg', 'unit' => 'Pack', 'price' => 44740],
            ['product_id' => 'MD0033', 'category' => 'Dry Goods', 'product_name' => 'Delmonte Tomat 1Kg', 'unit' => 'Pack', 'price' => 14950],
            ['product_id' => 'MD0034', 'category' => 'Dry Goods', 'product_name' => 'Sedotan Hot Coffee', 'unit' => 'Pack', 'price' => 17890],
            ['product_id' => 'MD0035', 'category' => 'Dry Goods', 'product_name' => 'Creamer Santos 1Kg', 'unit' => 'Pack', 'price' => 38950],
            ['product_id' => 'MD0036', 'category' => 'Dry Goods', 'product_name' => 'Teh Goalpara', 'unit' => 'Pack', 'price' => 9470],
            ['product_id' => 'MD0037', 'category' => 'Dry Goods', 'product_name' => 'Whincheese 250G', 'unit' => 'Pack', 'price' => 12630],
            ['product_id' => 'MD0038', 'category' => 'Dry Goods', 'product_name' => 'Elner Crunchy Tiramisu', 'unit' => 'Pack', 'price' => 73680],
            ['product_id' => 'MD0039', 'category' => 'Dry Goods', 'product_name' => 'Gula Sachet', 'unit' => 'Pack', 'price' => 73680],
            ['product_id' => 'MD0040', 'category' => 'Dry Goods', 'product_name' => 'Knor Chicken 1Kg', 'unit' => 'Pack', 'price' => 99470],
            ['product_id' => 'MD0041', 'category' => 'Dry Goods', 'product_name' => 'Plastik Sampah 60X100', 'unit' => 'Pack', 'price' => 58520],
            ['product_id' => 'MD0042', 'category' => 'Dry Goods', 'product_name' => 'Sedotan Steril Hitam Flexibel', 'unit' => 'Pack', 'price' => 21050],
            ['product_id' => 'MD0043', 'category' => 'Dry Goods', 'product_name' => 'Sedotan Flexibel Hitam 1Kg', 'unit' => 'Pack', 'price' => 44210],
            ['product_id' => 'MD0044', 'category' => 'Dry Goods', 'product_name' => 'Sedotan Steril Runcing Hitam', 'unit' => 'Pack', 'price' => 19470],
            ['product_id' => 'MD0045', 'category' => 'Dry Goods', 'product_name' => 'Leci Kaleng', 'unit' => 'Pack', 'price' => 28110],
            ['product_id' => 'MD0049', 'category' => 'Dry Goods', 'product_name' => 'Bobatee', 'unit' => 'Pack', 'price' => 22110],
            ['product_id' => 'MD0051', 'category' => 'Dry Goods', 'product_name' => 'Gulaku Gula Pasir 1 Kg', 'unit' => 'Pack', 'price' => 15260],
            ['product_id' => 'MD0056', 'category' => 'Dry Goods', 'product_name' => 'Cup Sealer', 'unit' => 'Pack', 'price' => 42110],
            ['product_id' => 'MD0060', 'category' => 'Dry Goods', 'product_name' => 'Lee Kum Kee Oyster Suce 770 Gr', 'unit' => 'Botol', 'price' => 63160],
            ['product_id' => 'MD0068', 'category' => 'Dry Goods', 'product_name' => 'Euro Gourmate Cheese Sauce', 'unit' => 'Pack', 'price' => 21050],
            ['product_id' => 'MD0069', 'category' => 'Dry Goods', 'product_name' => 'Gula Aren', 'unit' => 'Pack', 'price' => 42110],
            ['product_id' => 'MD0070', 'category' => 'Dry Goods', 'product_name' => 'Elmer Tiramizu Glazed Cruncy', 'unit' => 'Pail', 'price' => 65790],
            ['product_id' => 'MD0071', 'category' => 'Dry Goods', 'product_name' => 'Frutaneira Lyche Can', 'unit' => 'Can', 'price' => 28110],
            ['product_id' => 'MD0072', 'category' => 'Dry Goods', 'product_name' => 'Plastik Sampah 100X120', 'unit' => 'Pack', 'price' => 115790],
            ['product_id' => 'MD0074', 'category' => 'Dry Goods', 'product_name' => 'Imperium Tissue Hand Towel', 'unit' => 'Pack', 'price' => 8000],
            ['product_id' => 'MD0075', 'category' => 'Dry Goods', 'product_name' => 'Imeperium Tisue Pop Up', 'unit' => 'Pack', 'price' => 21050],
            ['product_id' => 'MD0076', 'category' => 'Dry Goods', 'product_name' => 'Imperium Tisue Facial', 'unit' => 'Pack', 'price' => 3050],
            ['product_id' => 'MD0077', 'category' => 'Dry Goods', 'product_name' => 'Lafonte Spagety 1 Kg', 'unit' => 'Pack', 'price' => 27890],
            ['product_id' => 'MD0088', 'category' => 'Dry Goods', 'product_name' => 'Gulaku Gla Pasir Kuning 1 Kg', 'unit' => 'Pack', 'price' => 13470],
            ['product_id' => 'MD0092', 'category' => 'Dry Goods', 'product_name' => 'Santos Cremer', 'unit' => 'Pack', 'price' => 42110],
            ['product_id' => 'MD0095', 'category' => 'Dry Goods', 'product_name' => 'Marie Regal', 'unit' => 'Pack', 'price' => 24740],
            ['product_id' => 'MD0094', 'category' => 'Dry Goods', 'product_name' => 'Delmonte Extra Hot Sachet', 'unit' => 'Pack', 'price' => 7370],
            ['product_id' => 'MD0101', 'category' => 'Dry Goods', 'product_name' => 'Oreo Crumb', 'unit' => 'Pack', 'price' => 64210],
            ['product_id' => 'MD0103', 'category' => 'Dry Goods', 'product_name' => 'Elmer Tiramizu Glazed', 'unit' => 'Pail', 'price' => 57890],
            ['product_id' => 'MD0102', 'category' => 'Dry Goods', 'product_name' => 'Kecap Bangau', 'unit' => 'Pack', 'price' => 178950],
            ['product_id' => 'MD0108', 'category' => 'Dry Goods', 'product_name' => 'Elemr Tiramizu Glazed', 'unit' => 'Pail', 'price' => 58950],
            ['product_id' => 'MD0107', 'category' => 'Dry Goods', 'product_name' => 'Elmer Green Tea Glazed', 'unit' => 'Pail', 'price' => 58950],
            ['product_id' => 'MD0106', 'category' => 'Dry Goods', 'product_name' => 'Elmer Dark Choco Glazed', 'unit' => 'Pail', 'price' => 58950],
            ['product_id' => 'MD0110', 'category' => 'Dry Goods', 'product_name' => 'Herseys Coklat', 'unit' => 'Botol', 'price' => 72000],
            ['product_id' => 'MD0113', 'category' => 'Dry Goods', 'product_name' => 'Keju Whincheese 2 Kg', 'unit' => 'Pack', 'price' => 100000],
            ['product_id' => 'MD0115', 'category' => 'Dry Goods', 'product_name' => 'Madu Nusantara', 'unit' => 'Botol', 'price' => 121050],
            ['product_id' => 'MD0120', 'category' => 'Dry Goods', 'product_name' => 'Saori Saus Tiram', 'unit' => 'Botol', 'price' => 51580],
            ['product_id' => 'MD0121', 'category' => 'Dry Goods', 'product_name' => 'Delmonte Extra Hot Pouch', 'unit' => 'Pack', 'price' => 20840],
            ['product_id' => 'MD0124', 'category' => 'Dry Goods', 'product_name' => 'Ultra Aroma Sachet Keju', 'unit' => 'Pack', 'price' => 4690],
            ['product_id' => 'MD0123', 'category' => 'Dry Goods', 'product_name' => 'Ultra Aroma Sachet Bbq', 'unit' => 'Pack', 'price' => 4690],
            ['product_id' => 'MD0122', 'category' => 'Dry Goods', 'product_name' => 'Ultra Aroma Sachet Balado 100Gr', 'unit' => 'Pack', 'price' => 4690],

            // Minuman
            ['product_id' => 'MD006', 'category' => 'Minuman', 'product_name' => 'Tofico Vanilla', 'unit' => 'Botol', 'price' => 105260],
            ['product_id' => 'MD007', 'category' => 'Minuman', 'product_name' => 'Tofico Almond', 'unit' => 'Botol', 'price' => 105260],
            ['product_id' => 'MD008', 'category' => 'Minuman', 'product_name' => 'Tofico Caramel', 'unit' => 'Botol', 'price' => 105260],
            ['product_id' => 'MD009', 'category' => 'Minuman', 'product_name' => 'Tofico Hazelnut', 'unit' => 'Botol', 'price' => 105260],
            ['product_id' => 'MD0010', 'category' => 'Minuman', 'product_name' => 'Tofico Blue Citrus', 'unit' => 'Botol', 'price' => 105260],
            ['product_id' => 'MD0011', 'category' => 'Minuman', 'product_name' => 'Spite 1L', 'unit' => 'Botol', 'price' => 9470],
            ['product_id' => 'MD0012', 'category' => 'Minuman', 'product_name' => 'Merapi Pandan', 'unit' => 'Botol', 'price' => 68420],
            ['product_id' => 'MD0013', 'category' => 'Minuman', 'product_name' => 'Tjampolay Strawbery', 'unit' => 'Botol', 'price' => 41050],
            ['product_id' => 'MD0014', 'category' => 'Minuman', 'product_name' => 'Monin Banana', 'unit' => 'Botol', 'price' => 153680],
            ['product_id' => 'MD0015', 'category' => 'Minuman', 'product_name' => 'Denali Mojito Mint', 'unit' => 'Botol', 'price' => 97890],
            ['product_id' => 'MD0016', 'category' => 'Minuman', 'product_name' => 'Denali Pandan', 'unit' => 'Botol', 'price' => 97890],
            ['product_id' => 'MD0017', 'category' => 'Minuman', 'product_name' => 'Denali Blue Citrus', 'unit' => 'Botol', 'price' => 97890],
            ['product_id' => 'MD0018', 'category' => 'Minuman', 'product_name' => 'Marjan Lemon', 'unit' => 'Botol', 'price' => 19760],
            ['product_id' => 'MD0019', 'category' => 'Minuman', 'product_name' => 'Marjan Leci Hijau', 'unit' => 'Botol', 'price' => 19760],
            ['product_id' => 'MD0020', 'category' => 'Minuman', 'product_name' => 'Marjan Vanilla', 'unit' => 'Botol', 'price' => 19760],
            ['product_id' => 'MD0021', 'category' => 'Minuman', 'product_name' => 'Marjan Strawbery', 'unit' => 'Botol', 'price' => 19760],
            ['product_id' => 'MD0028', 'category' => 'Minuman', 'product_name' => 'Uht Diamond 1L', 'unit' => 'Pack', 'price' => 16530],
            ['product_id' => 'MD0029', 'category' => 'Minuman', 'product_name' => 'Uht Indomilk 950Ml', 'unit' => 'Pack', 'price' => 15710],
            ['product_id' => 'MD0030', 'category' => 'Minuman', 'product_name' => 'Uht Omela 1L', 'unit' => 'Pack', 'price' => 16180],
            ['product_id' => 'MD0046', 'category' => 'Minuman', 'product_name' => 'Skm Omela 490G', 'unit' => 'Pack', 'price' => 13370],
            ['product_id' => 'MD0047', 'category' => 'Minuman', 'product_name' => 'Amare Lychee Tea', 'unit' => 'Pack', 'price' => 58950],
            ['product_id' => 'MD0053', 'category' => 'Minuman', 'product_name' => 'Merapi Caramel', 'unit' => 'Botol', 'price' => 68420],
            ['product_id' => 'MD0054', 'category' => 'Minuman', 'product_name' => 'Merapi Hazelnut', 'unit' => 'Botol', 'price' => 68420],
            ['product_id' => 'MD0055', 'category' => 'Minuman', 'product_name' => 'Merapi Roma', 'unit' => 'Botol', 'price' => 68420],
            ['product_id' => 'MD0057', 'category' => 'Minuman', 'product_name' => 'Marjan Lyche Squash', 'unit' => 'Botol', 'price' => 11370],
            ['product_id' => 'MD0058', 'category' => 'Minuman', 'product_name' => 'Monin Elder Flower', 'unit' => 'Botol', 'price' => 152630],
            ['product_id' => 'MD0059', 'category' => 'Minuman', 'product_name' => 'Tjampolay Pisang Susu', 'unit' => 'Botol', 'price' => 41050],
            ['product_id' => 'MD0061', 'category' => 'Minuman', 'product_name' => 'Amare Green Tea', 'unit' => 'Pack', 'price' => 58840],
            ['product_id' => 'MD0062', 'category' => 'Minuman', 'product_name' => 'Amare Taro', 'unit' => 'Pack', 'price' => 58840],
            ['product_id' => 'MD0063', 'category' => 'Minuman', 'product_name' => 'Amare Vanilla Creamy', 'unit' => 'Pack', 'price' => 58840],
            ['product_id' => 'MD0064', 'category' => 'Minuman', 'product_name' => 'Amare Dark Choco', 'unit' => 'Pack', 'price' => 58840],
            ['product_id' => 'MD0065', 'category' => 'Minuman', 'product_name' => 'Amare Bublr Gum', 'unit' => 'Pack', 'price' => 58840],
            ['product_id' => 'MD0066', 'category' => 'Minuman', 'product_name' => 'Amare Royalchoco', 'unit' => 'Pack', 'price' => 58840],
            ['product_id' => 'MD0067', 'category' => 'Minuman', 'product_name' => 'Amare Strawbery Milky', 'unit' => 'Pack', 'price' => 58840],
            ['product_id' => 'MD0073', 'category' => 'Minuman', 'product_name' => 'Tong Tji 50 Gr', 'unit' => 'Pack', 'price' => 5160],
            ['product_id' => 'MD0087', 'category' => 'Minuman', 'product_name' => 'Uht Frisiant Flagh', 'unit' => 'Pack', 'price' => 15130],
            ['product_id' => 'MD0093', 'category' => 'Minuman', 'product_name' => 'Amare Red Vavet', 'unit' => 'Pack', 'price' => 58840],
            ['product_id' => 'MD0099', 'category' => 'Minuman', 'product_name' => 'Marjan Orange Squash', 'unit' => 'Botol', 'price' => 13790],
            ['product_id' => 'MD0098', 'category' => 'Minuman', 'product_name' => 'Marjan Manggo Squash', 'unit' => 'Botol', 'price' => 13790],
            ['product_id' => 'MD0104', 'category' => 'Minuman', 'product_name' => 'Tofico Mojito Mint', 'unit' => 'Botol', 'price' => 105260],
            ['product_id' => 'MD0105', 'category' => 'Minuman', 'product_name' => 'Tjampolay Pisang Susu', 'unit' => 'Botol', 'price' => 41050],
            ['product_id' => 'MD0111', 'category' => 'Minuman', 'product_name' => 'Fres Milk', 'unit' => 'Pack', 'price' => 19470],
            ['product_id' => 'MD0114', 'category' => 'Minuman', 'product_name' => 'Point Thai Tea', 'unit' => 'Pack', 'price' => 68420],
            ['product_id' => 'MD0118', 'category' => 'Minuman', 'product_name' => 'Monin Irish', 'unit' => 'Botol', 'price' => 152630],
            ['product_id' => 'MD0117', 'category' => 'Minuman', 'product_name' => 'Dripp Pistachio', 'unit' => 'Botol', 'price' => 116840],

            // Chemical
            ['product_id' => 'MD0027', 'category' => 'Chemical', 'product_name' => 'Sunshine SL', 'unit' => 'Jerigen', 'price' => 31580],
            ['product_id' => 'MD0089', 'category' => 'Chemical', 'product_name' => 'Sunshine', 'unit' => 'Jerigen', 'price' => 31580],
            ['product_id' => 'MD0090', 'category' => 'Chemical', 'product_name' => 'All Clean Sabun Cuci Tangan', 'unit' => 'Jerigen', 'price' => 42110],
            ['product_id' => 'MD0091', 'category' => 'Chemical', 'product_name' => 'All Clean Sabun Lantai', 'unit' => 'Jerigen', 'price' => 42110],
        ];

        foreach ($data as $item) {
            PriceList::updateOrCreate(
                ['product_id' => $item['product_id']],
                $item
            );
        }
    }
}
