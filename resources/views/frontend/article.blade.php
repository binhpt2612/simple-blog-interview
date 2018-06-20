@extends('layouts.app')

@section('title', 'Page Title')

@section('content')
    <h2 style="font-size: 20px;font-weight:bold;">{{$article->title}}</h2>
    <h3 style="font-size: 15px;font-weight:bold;">{{$article->lead}}n</h3>
    <p>Ngày tạo : <i>{{$article->created_at}}</i></i></p>
    <div>{!! $article->content !!}</div>
@endsection
