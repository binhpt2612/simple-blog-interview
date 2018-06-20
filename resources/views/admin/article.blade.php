@extends('layouts.admin')

@section('stylesheets')
<link rel="stylesheet" href="{{asset('/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css')}}">
@stop

@section('title', 'Page Title')

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Text Editors</h1>
                </div>
            </div>
        </div>
        <!-- /.container-fluid -->
    </section>
    <!-- Main content -->
    <section class="content">
        <form action="{{ route('article.add') }}" method="POST">
            
            @if (isset($article_detail->id) && $article_detail->id > 0)
                <input type="hidden" name="article_id" value="{{$article_detail->id}}">
            @endif
            
            <div class="form-group">
                <label>Title</label>
                <input type="text" name="title" class="form-control" placeholder="Enter title" value="{{ $article_detail->title or '' }}">
                @if ($errors->has('title'))
			  	<p style="color:#f56954">{{$errors->first('title')}}</p>
			    @endif
			    @if ($errors->has('errorTitle'))
        			<p style="color:#f56954">{{$errors->first('errorTitle')}}</p>
        		@endif
            </div>
            
            <div class="form-group">
                <label>Lead</label>
                <input type="text" name="lead" class="form-control" placeholder="Enter lead" value="{{ $article_detail->lead or '' }}">
                @if ($errors->has('lead'))
			  	<p style="color:#f56954">{{$errors->first('lead')}}</p>
			    @endif
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <div class="card card-outline card-info">
                        <div class="card-header">
                            <h3 class="card-title">Content</h3>
                        </div>
                        <div class="card-body pad">
                            <div class="mb-3">
                                <textarea class="textarea" name="content"
                                    style="width: 100%; height: 400px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;">
                                    {{ $article_detail->content or '' }}
                                </textarea>
                                @if ($errors->has('content'))
                			  	<p style="color:#f56954">{{$errors->first('content')}}</p>
                			    @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
            {!! csrf_field() !!}
        </form>
    </section>
<!-- /.content-wrapper -->
@endsection

@section('pagescript')
    <script src="{{asset('/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js')}}"></script>
    <script src="{{asset('/plugins/ckeditor/ckeditor.js')}}"></script>
    <script type="text/javascript" >
        $('.textarea').wysihtml5({
          toolbar: { fa: true }
        });
    </script>
@stop