const pool = require('./db');

// ---------------------------------------------------------------
// TUGAS 2: Operasi UPDATE (judul buku berdasarkan id) - parameterized query
// ---------------------------------------------------------------
async function updateBookTitle(bookId, newTitle) {
    const sql = 'UPDATE books SET title = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [newTitle, bookId]);
    return result.affectedRows > 0;
}

// ---------------------------------------------------------------
// TUGAS 3: Operasi DELETE (penulis berdasarkan id) - parameterized query
// Buku milik penulis ikut terhapus karena ON DELETE CASCADE
// ---------------------------------------------------------------
async function deleteAuthor(authorId) {
    const sql = 'DELETE FROM authors WHERE id = ?';
    const [result] = await pool.execute(sql, [authorId]);
    return result.affectedRows > 0;
}

async function tampilkanSemuaBuku() {
    const [rows] = await pool.execute('SELECT * FROM books');
    console.table(rows);
}

async function main() {
    try {
        // --- 1. INSERT DATA MENGGUNAKAN PARAMETERIZED QUERY ---
        console.log('\n--- Menambahkan Data Penulis ---');
        const insertAuthorSql = 'INSERT INTO authors (name, email) VALUES (?, ?)';
        const [authorResult] = await pool.execute(insertAuthorSql, ['Tere Liye', 'tereliye@example.com']);
        const authorId = authorResult.insertId;
        console.log(`✅ Penulis berhasil ditambahkan dengan ID: ${authorId}`);

        // Penulis kedua, dipakai untuk membuktikan efek CASCADE hanya mengenai penulis yang dihapus
        const [author2Result] = await pool.execute(insertAuthorSql, ['Andrea Hirata', 'andreahirata@example.com']);
        const author2Id = author2Result.insertId;
        console.log(`✅ Penulis berhasil ditambahkan dengan ID: ${author2Id}`);

        console.log('\n--- Menambahkan Data Buku ---');
        const insertBookSql = 'INSERT INTO books (title, author_id, published_year, stock) VALUES (?, ?, ?, ?)';
        await pool.execute(insertBookSql, ['Bumi', authorId, 2014, 10]);
        await pool.execute(insertBookSql, ['Bulan', authorId, 2015, 8]);
        await pool.execute(insertBookSql, ['Laskar Pelangi', author2Id, 2005, 12]);
        console.log(`✅ Buku-buku berhasil ditambahkan.`);

        // --- 2. SELECT DATA (READ DENGAN JOIN) ---
        console.log('\n--- Menampilkan Semua Data Buku dan Penulisnya ---');
        const selectSql = `
            SELECT books.id, books.title, books.published_year, books.stock, authors.name AS author_name
            FROM books
            JOIN authors ON books.author_id = authors.id
        `;
        const [books] = await pool.execute(selectSql);
        console.table(books);

        // --- 3. AMBIL DATA DENGAN FILTER AMAN ---
        console.log('\n--- Mencari Buku Berdasarkan Tahun Terbit ---');
        const searchYear = 2014;
        const searchSql = 'SELECT * FROM books WHERE published_year = ?';
        const [filteredBooks] = await pool.execute(searchSql, [searchYear]);
        console.log(`Buku yang terbit tahun ${searchYear}:`, filteredBooks);

        // --- 4. TUGAS 2: UPDATE JUDUL BUKU BERDASARKAN ID ---
        console.log('\n--- Memperbarui Judul Buku (UPDATE) ---');
        const bookIdToUpdate = 1;
        const updated = await updateBookTitle(bookIdToUpdate, 'Bumi - Edisi Spesial');
        console.log(updated
            ? `✅ Judul buku dengan ID ${bookIdToUpdate} berhasil diperbarui.`
            : `⚠️ Buku dengan ID ${bookIdToUpdate} tidak ditemukan.`);
        const [afterUpdate] = await pool.execute('SELECT * FROM books WHERE id = ?', [bookIdToUpdate]);
        console.table(afterUpdate);

        // --- 5. TUGAS 3: DELETE PENULIS BERDASARKAN ID (EFEK CASCADE) ---
        console.log('\n--- Data Buku SEBELUM Penulis Dihapus ---');
        await tampilkanSemuaBuku();

        console.log(`--- Menghapus Penulis dengan ID ${authorId} (DELETE) ---`);
        const deleted = await deleteAuthor(authorId);
        console.log(deleted
            ? `✅ Penulis dengan ID ${authorId} berhasil dihapus.`
            : `⚠️ Penulis dengan ID ${authorId} tidak ditemukan.`);

        console.log('\n--- Data Buku SESUDAH Penulis Dihapus (efek ON DELETE CASCADE) ---');
        await tampilkanSemuaBuku();

    } catch (error) {
        console.error('❌ Terjadi kesalahan operasi database:', error);
    } finally {
        await pool.end();
        console.log('\n🔒 Koneksi database ditutup dengan aman.');
    }
}

main();
