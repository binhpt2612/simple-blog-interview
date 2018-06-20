@extends('layouts.admin')

@section('title', 'Page Title')
@section('stylesheets')
<link rel="stylesheet" href="{{asset('/plugins/fancybox/dist/jquery.fancybox.min.css')}}">
@stop
@section('content')
	<section class="content">
		<div class="row">
		  <div class="col-12">
			<div class="card">
			  <div class="card-header">
				<h3 class="card-title">Responsive Hover Table</h3>

				<div class="card-tools">
				  <div class="input-group input-group-sm" style="width: 150px;">
					<input type="text" name="table_search" class="form-control float-right" placeholder="Search">

					<div class="input-group-append">
					  <button type="submit" class="btn btn-default"><i class="fa fa-search"></i></button>
					</div>
				  </div>
				</div>
			  </div>
			  <!-- /.card-header -->
			  <div class="card-body table-responsive p-0">
				<table class="table table-hover">
				<tbody>
				<tr>
					<th></th>
					<th>ID</th>
					<th>Title</th>
					<th>Lead</th>
					<th>Created at</th>
					<th>Updated at</th>
					<th>Status</th>
					<th>Action</th>
				</tr>
				@foreach ($articles as $article)
					<tr>
						<td>
							<a class="show_detail" data-article-url="{{route('article.getdetail', ['article_id' => $article->id])}}" href="javascript:;" class="nav-link">
							  <i class="nav-icon fa fa-plus-square-o"></i>
							</a>
						</td>
						<td>{{ $article->id }}</td>
						<td>{{ $article->title }}</td>
						<td>{{ $article->lead }}</td>
						<td>{{ $article->created_at }}</td>
						<td>{{ $article->updated_at }}</td>
						<td>
							@if ($article->status === 1)
								<a href="{{ Auth::user()->role == 1 ? route('article.unpublish', ['article_id' => $article->id]) : "javascript:;" }}" title="Publish"><span class="badge bg-success">Publish</span></a>
							@elseif ($article->status === 0)
								<a href="{{Auth::user()->role == 1 ? route('article.publish', ['article_id' => $article->id]) : "javascript:;" }}" title="Publish"><span class="badge bg-success">UnPublish</span></a>
							@endif
						</td>
						<td>
							<a href="{{route('article.edit', ['article_id' => $article->id])}}" title="Edit"><span class="badge bg-warning">Edit</span></a>
							<a href="{{route('article.delete', ['article_id' => $article->id])}}" title="Delete"><span class="badge bg-danger">Delete</span></a>
						</td>
					</tr>
				@endforeach
				  
				  
				</tbody>
				</table>
			  </div>
			  <!-- /.card-body -->
			</div>
			<!-- /.card -->
		  </div>
		</div>
	</section>
	
<!-- /.content-wrapper -->
@endsection

@section('pagescript')
<script type="text/javascript" src="{{asset('/plugins/fancybox/dist/jquery.fancybox.min.js')}}"></script>
<script type="text/javascript">
	
	$(".show_detail").click(function(){
		var url = $(this).attr("data-article-url") || false;
		console.log(url);
		if(url){
			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'json'
			}).done(function(data, textStatus, jqXHR) {
				
				var html = '<h2 style="font-size: 20px;font-weight:bold;">'+ data.title +'</h2>\
						    <h3 style="font-size: 15px;font-weight:bold;">'+ data.lead +'</h3>\
						    <p>Ngày tạo : <i>'+ data.created_at +'</i></i></p>\
						    <div>'+ data.content +'</div>';
				    $.fancybox.open('<div class="message">' + html + '</div>');
				    
			}).fail(function(jqXHR, textStatus, errorThrown) {
				// the response is not guaranteed to be json
				if (jqXHR.responseJSON) {
					// jqXHR.reseponseJSON is an object
					console.log('failed with json data');
				}
				else {
					// jqXHR.responseText is not JSON data
					console.log('failed with unknown data'); 
				}
			}).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
				console.log('always');
			});
		}
	});
  
</script>
@stop