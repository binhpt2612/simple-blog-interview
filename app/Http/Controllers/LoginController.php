<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use Auth;
use Illuminate\Support\MessageBag;

class LoginController extends Controller
{
    public function getLogin(){
        return view('login');    
    }
    
    public function postLogin(Request $request){
        
        $validator = Validator::make($request->all(), [
            'email'     => 'required|email',
            'password'  => 'required|min:8',
        ],[
            'email.required'    => "Email không thể bỏ trống",
            'email.email'       => "Email không đúng định dạng",
            'password.required' => "Password không thể bỏ trống",
            'password.min'      => "Password không đủ độ dài"
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }else{
            $email = $request->input("email");
            $password = $request->input("password");
            
            if (Auth::attempt(['email' => $email, 'password' => $password, 'status' => 1])) {
                return redirect()->intended('admin');
            }else{
                $error = new MessageBag(["errorLogin" => "Email hoặc password không đúng"]);
                return redirect()->back()->withInput()->withErrors($error);
            }

        }
        
    }
    
}
