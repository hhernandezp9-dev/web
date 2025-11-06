<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "proyecto_matematicas";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("❌ Conexión fallida: " . $conn->connect_error);
}


$nombre = $_POST['nombre'] ?? '';
$codigo = $_POST['codigo'] ?? '';
$puntaje = $_POST['puntaje'] ?? 0;
$tipo_juego = $_POST['tipo_juego'] ?? '';


if (empty($nombre) || empty($codigo)) {
    die("❌ Faltan datos obligatorios (nombre o código).");
}


$sql = "INSERT INTO alumnos (nombre, codigo, puntaje, tipo_juego) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssis", $nombre, $codigo, $puntaje, $tipo_juego);

if ($stmt->execute()) {
    echo "✅ Puntaje guardado correctamente.";
} else {
    echo "❌ Error al guardar: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
