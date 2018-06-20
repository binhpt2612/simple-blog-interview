<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>AdminLTE 3 | Log in</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
	<link rel="stylesheet" href="/dist/css/adminlte.min.css">
	<link rel="stylesheet" href="/plugins/iCheck/square/blue.css">
	<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
</head>
<body class="hold-transition login-page">
<div class="login-box">
  <div class="login-logo">
	<a href="/"><b>Admin</b>LTE</a>
  </div>
  <!-- /.login-logo -->
  <div class="card">
	<div class="card-body login-card-body">
	  	<p class="login-box-msg">Sign in to start your session</p>
		@if ($errors->has('errorLogin'))
			<p style="color:#f56954">{{$errors->first('errorLogin')}}</p>
		@endif
	  	<form action="{{url('login')}}" method="post">
		<div class="form-group has-feedback">
		  <input type="email" class="form-control" placeholder="Email" name="email">
		  <span class="fa fa-envelope form-control-feedback"></span>
		  	@if ($errors->has('email'))
			  	<p style="color:#f56954">{{$errors->first('email')}}</p>
			@endif
		</div>
		<div class="form-group has-feedback">
		  	<input type="password" class="form-control" placeholder="Password" name="password">
		  	<span class="fa fa-lock form-control-feedback"></span>
			@if ($errors->has('password'))
				<p style="color:#f56954">{{$errors->first('password')}}</p>
			@endif
		</div>
		<div class="row">
			  <div class="col-8">
				<div class="checkbox icheck">
				  <label>
					<input type="checkbox"> Remember Me
				  </label>
				</div>
			  </div>
		  <!-- /.col -->
		  <div class="col-4">
			<button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
		  </div>
		  <!-- /.col -->
		  {!! csrf_field() !!}
		</div>
	  </form>
	  <!-- /.social-auth-links -->
	</div>
	<!-- /.login-card-body -->
  </div>
</div>

<!-- jQuery -->
<script src="/plugins/jquery/jquery.min.js"></script>
<script src="/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="/plugins/iCheck/icheck.min.js"></script>
</body>
</html>
