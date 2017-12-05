<?php
 $user_name = $_POST['user_name'];
 $user_phone = $_POST['user_phone'];
 $user_street = $_POST['user_street'];
 $user_home = $_POST['user_home'];
 $user_block = $_POST['user_block'];
 $user_flat = $_POST['user_flat'];
 $user_floor = $_POST['user_floor'];
 $user_comment = $_POST['user_comment'];
 $user_isCard = $_POST['user_isCard'];

 // это checkbox
 $user_isCall = $_POST['user_isCall'];

 // проверим был ли нажат checkbox
 $user_isCall = isset($user_isCall) ? 'не перезванивать' : 'перезванивать';


// формируем данные для отправки
$to      = 'alex.gorn20@gmail.com';
$subject = 'Заказ от ' . $user_name;
$message = '
<html>
    <head>
        <title>'.$subject.'</title>
    </head>
    <body>
        <p>Имя: '.$user_name.'</p>
        <p>Телефон: '.$user_phone.'</p>   
        <p>Улица: '.$user_street.'</p>                        
        <p>Дом: '.$user_home.'</p>                        
        <p>Корпус: '. $user_block.'</p>                        
       <p>Квартира: '.$user_flat.'</p>  
       <p>Этаж: '. $user_floor.'</p>  
       <p>Комментарий: '.$user_comment.'</p>  
       <p>Оплата: '.$user_isCard.'</p>  
        <p>Не перезванивать: '.$user_isCall.'</p>                             
   </body>
</html>';


$headers = "From: Александр <alex.gorn20@gmail.com>\r\n".
"MIME-Version: 1.0"."\r\n".
"Content-type: text/html; charset=UTF-8"."\r\n";

// Отправляем
$isMailed = mail($to, $subject, $message, $headers);

$responseJSON; 

if ($isMailed){
    $responseJSON['status'] = true;
    $responseJSON['message'] = 'Спасибо за заказ, в течении дня мы с вами свяжемся!';
}else{
    $responseJSON['status'] = false;
    $responseJSON['message'] = 'Упс! Ошибочка на сервере';
}

echo json_encode($responseJSON);
 
?>