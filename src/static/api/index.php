<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$data = $_POST;

if (!preg_match('/\/\/.*riteilmarket.ru/', $_SERVER['HTTP_REFERER'])) {
    http_response_code(400);
    die();
}

$name = $_POST['name'] ?? false;
if (!$name || !preg_match('/^.{2,}$/', $name)) {
    http_response_code(400);
    die();
}

$phone = $_POST['phone'] ?? false;
if (!$phone || !preg_match('/^\+\d\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}$/', $phone)) {
    http_response_code(400);
    die();
}

$email = $_POST['email'] ?? false;
if (!$email || !preg_match('/^.{1,}@.{1,}\..{2,3}$/', $email)) {
    http_response_code(400);
    die();
}

$ip = $_SERVER['REMOTE_ADDR'];

$message = "Новоя заявка:\r\n";
$message .= "Имя: $name\r\n";
$message .= "Телефон: $phone\r\n";
$message .= "Email: $email\r\n";

$res = mail('info@riteilmarket.ru', 'Новая заяка на riteilmarket.ru', $message, ['From' => 'no-reply@riteilmarket.ru']);
mail($email, 'Ваша заяка на riteilmarket.ru зарегистрирована', $message, ['From' => 'no-reply@riteilmarket.ru']);
echo json_encode(['success' => $res]);
