@extends('layouts.app')

@section('title', 'Page Title')

@section('content')
    @foreach ($articles as $article)
        <div class="post">
            <h5 style="text-align: left;"><a href="{{route('home.blog', ['slug' => $article->slug, 'id' => $article->id])}}">{{$article->title}}</a></h3>
            <h6 style="text-align: left;">{{$article->lead}}</h4>
        </div>
    @endforeach
    {{ $articles->links() }}
@endsection
