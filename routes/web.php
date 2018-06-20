<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@index')->name('home');
Route::get('blog/{slug}-{id}.html', "HomeController@detail")->where(['slug' => '[a-z0-9-]+','id' => '[0-9]+'])->name("home.blog");

Route::get('login', 'LoginController@getLogin')->name('login');
Route::post('login', 'LoginController@postLogin');
Route::get('admin', 'AdminController@dashbroad')->name('admin')->middleware('auth');
Route::match(array('GET', 'POST'), '/admin/add-article', 'ArticleController@add')->name('article.add')->middleware('auth');
Route::get('/admin/edit-article/{article_id}', 'ArticleController@edit')->name('article.edit')->middleware('auth');
Route::get('/admin/list-article', 'ArticleController@list')->name('article.list')->middleware('auth');
Route::get('/admin/delete-article/{article_id}', 'ArticleController@delete')->name('article.delete')->middleware('auth');
Route::get('/admin/publish-article/{article_id}', 'ArticleController@publish')->name('article.publish')->middleware('auth');
Route::get('/admin/un-publish-article/{article_id}', 'ArticleController@unPublish')->name('article.unpublish')->middleware('auth');
Route::get('/admin/get-detail-article/{article_id}', 'ArticleController@getDetail')->name('article.getdetail')->middleware('auth');