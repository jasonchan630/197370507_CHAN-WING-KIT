IP = 'http://localhost';
PORT = '3000';
HOST = IP + ':' + PORT;

REGISTER_API =  HOST + '/register';
LOGIN_API =  HOST + '/login';
LOGOUT_API =  HOST + '/logout';
USER_ARTICLE_API =  HOST + '/user/articles';
COLLECT_ARTICLE_API =  HOST + '/article/collect';
COMMENT_ARTICLE_API =  HOST + '/article/comments';
COMMENT_List_API =  HOST + '/comments';

function register() {
    let username = $('#username').val();
    let password = $('#password').val();
    if(username == '' || password == '') {
        return false;
    }
    $.ajax({
        url:REGISTER_API,
        data:{
            "username": username,
            "password" :password,
        },
        dataType:'json',
        type:'post',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.href = 'login'
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
}

function login() {
    let username = $('#username').val();
    let password = $('#password').val();
    if(username == '' || password == '') {
        return false;
    }
    $.ajax({
        url:LOGIN_API,
        data:{
            "username": username,
            "password" :password,
        },
        dataType:'json',
        type:'post',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.href = 'all_article'
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
}

function logout() {
    $.ajax({
        url:LOGOUT_API,
        data:{
        },
        dataType:'json',
        type:'post',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.href = 'login'
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
}


function addNewArticle() {
    let title = $('#title').val();
    let desciption = $('#description').val();
    let content = $('#content').val();

    let params = {
        "title" : title,
        "description" : desciption,
        "content" : content,
    }
    console.log(params)
    if (title == '' || desciption == '' || content == '') {
        alert('params err');return false;
    }
    $.ajax({
        url:USER_ARTICLE_API + '/0',
        dataType:"json",
        type:"POST",
        data:params,
        success:function (response) {
            console.log(response)
            if (response.success == true) {
                alert(response.msg)
                window.location.href='list_article'
            } else {
                alert(response.msg)
            }
        },
        error: function () {
            alert('server err')
        }
    })
}


function initMyArticleList() {
    $.ajax({
        url:USER_ARTICLE_API + '/0',
        dataType:"json",
        type:"GET",
        success:function (response) {
            if (response.success == true) {
                var t = ''
                $.each(response.data,function (k,item) {
                    let date = formattime(item.create_time)

                    t += `<tr><td><a href="javascript:void(0)" class="show-detail" data-title="${ item.title }" data-description="${ item.description }" data-content="${ item.content }">#${ k+1 }</a></td><td>${ item.title }</td><td>${ item.description }</td><td>${ date }</td><td><button class="btn btn-sm btn-danger del-article" data-aid="${ item._id }">delete</button>&nbsp;&nbsp;<button class="btn btn-sm btn-success edit-article" data-aid="${ item._id }">edit</button></td></tr>`
                })
                $('#group-list').append(t)
            } else {
                alert(response.msg)
            }
        }
    })
}


$('body').on('click','.del-article',function () {
    let aid = $(this).data('aid')
    $.ajax({
        url:USER_ARTICLE_API + '/' + aid,
        data:{
            "aid" : aid
        },
        dataType:'json',
        type:'DELETE',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.reload()
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
})


$('body').on('click','.edit-article',function () {
    let aid = $(this).data('aid')
    window.open(HOST + '/edit_article/' + aid)
})

$('body').on('click','.comment-list',function () {
    let aid = $(this).data('aid')
    window.open(HOST + '/list_comment/' + aid)
})




function saveArticle(e) {
    let aid = e.data('aid')
    let title = $('#title').val();
    let desciption = $('#description').val();
    let content = $('#content').val();

    let params = {
        "title" : title,
        "description" : desciption,
        "content" : content,
    }
    console.log(params)
    if (title == '' || desciption == '' || content == '') {
        alert('params err');return false;
    }
    $.ajax({
        url:USER_ARTICLE_API + '/' + aid,
        dataType:"json",
        type:"PUT",
        data:params,
        success:function (response) {
            if (response.success == true) {
                alert(response.msg)
                window.location.reload()
            } else {
                alert(response.msg)
            }
        },
        error: function () {
            alert('server err')
        }
    })
}


function initArticleList() {
    $.ajax({
        url:'articles',
        dataType:"json",
        type:"GET",
        success:function (response) {
            if (response.success == true) {
                var t = ''
                var now_uid = response.now_uid
                $.each(response.data,function (k,item) {
                    let banStaus = '';
                    if (item.uid == now_uid || !item.uid) {
                        banStaus = 'disabled'
                    }
                    let date = formattime(item.create_time)
                    t += `<tr><td><a href="javascript:void(0)" class="show-detail" data-description="${ item.description }" data-title="${ item.title }" data-content="${ item.content }">#${ k+1 }</a></td><td>${ item.title }</td><td>${ item.description }</td><td>${ date }</td><td><button class="btn btn-sm btn-danger collect-article" data-aid="${ item._id }" ${ banStaus }>collect</button>&nbsp;&nbsp;<button class="btn btn-sm btn-success comment-article" data-aid="${ item._id }" >add comment</button>&nbsp;&nbsp;<button class="btn btn-sm btn-warning comment-list" data-aid="${ item._id }"> more comment+</button></td></tr>`
                })
                $('#group-list').append(t)
            } else {
                alert(response.msg)
            }
        }
    })
}


function initArticleListIndex() {
    $.ajax({
        url:'articles',
        dataType:"json",
        type:"GET",
        success:function (response) {
            if (response.success == true) {
                var t = ''
                var now_uid = response.now_uid
                $.each(response.data,function (k,item) {
                    let banStaus = '';

                    let date = formattime(item.create_time)
                    t += `<tr><td><a href="javascript:void(0)" class="show-detail" data-content="${ item.content }" data-description="${ item.description }" data-title="${ item.title }">#${ k+1 }</a></td><td>${ item.title }</td><td>${ item.description }</td><td>${ date }</td></tr>`
                })
                $('#group-list').append(t)
            } else {
                alert(response.msg)
            }
        }
    })
}

$('body').on('click','.show-detail',function () {
    console.log($(this))
    console.log($(this).data('content'))
    let content = $(this).data('content')
    let comment = $(this).data('comment')
    let description = $(this).data('description')
    let title = $(this).data('title')
    $('#content-title').html(title)
    $('#content-description').html(description)
    $('#content-content').html(content)
    $('#content-comment').html(comment)
    $('#content-id').html($(this).text())
    $('#contentModal').modal('show')
})


function initCollectList()
{
    $.ajax({
        url:'/user/collect',
        dataType:"json",
        type:"GET",
        success:function (response) {
            console.log(response)
            if (response.success == true) {
                var t = ''
                $.each(response.data,function (k,item) {
                    let postdate = formattime(item.article[0].create_time)
                    let collectdate = formattime(item.create_time)

                    t += `<tr><td><a href="javascript:void(0)" class="show-detail" data-title="${ item.article[0].title }" data-description="${ item.article[0].description }" data-content="${ item.article[0].content }">#${ k+1 }</a></td><td>${ item.article[0].title }</td><td>${ item.article[0].description }</td><td>${ postdate }</td><td>${ collectdate }</td><td><button class="btn btn-primary del-collect" data-cid="${ item.id }">delete</button></td></tr>`
                })
                $('#group-list').append(t)
            } else {
                alert(response.msg)
            }
        }
    })
}


$('body').on('click','.collect-article',function () {
    let aid = $(this).data('aid')
    $.ajax({
        url:COLLECT_ARTICLE_API + '/0',

        data:{
            "aid" : aid
        },
        dataType:'json',
        type:'POST',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.reload()
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
})


$('body').on('click','.comment-article', function () {
    let aid = $(this).data('aid')
    $('#comment-aid').val(aid)
    $('#myModal').modal('show')
})


function addComment() {
    let content = $('#comment-content').val()
    let aid = $('#comment-aid').val()
    
    let params = {
        'content' : content,
        'aid' : aid 
    }
    
    console.log(params)
    
    if (content == '' || aid == '') {
        alert('The comment cannot empty.');return false
    }
    
    $.ajax({
        url:COMMENT_ARTICLE_API + '/0',

        data: params,
        dataType:'json',
        type:'post',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.reload()
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
    
}

function saveComment() {
    let content = $('#comment-content').val()
    let cid = $('#comment-cid').val()

    let params = {
        'content' : content,
        'aid' : aid
    }

    console.log(params)

    if (content == '') {
        alert('params err');return false
    }

    $.ajax({
        url:COMMENT_ARTICLE_API + '/' + cid,

        data: params,
        dataType:'json',
        type:'put',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.reload()
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
}


function initCommentList(aid) {
    $.ajax({
        url:COMMENT_List_API + '/' + aid,
        data: {},
        dataType:'json',
        type:'GET',
        success:function (response) {
            console.log(response)
            if (response.success == true) {
                var t = ''
                $.each(response.data,function (k,item) {
                    let postdate = formattime(item.article[0].create_time)
                    let commentdate = formattime(item.create_time)

                    if (item.uid != response.now_id) {
                        var disableStatus = 'disabled'
                    }
                    
                    t += `<tr><td><a href="javascript:void(0)" class="show-detail" data-description="${ item.article[0].description }" data-title="${ item.article[0].title }" data-content="${ item.article[0].content }" data-comment="${ item.content }">#${ k+1 }</a></td><td>${ item.article[0].title }</td><td>${ item.article[0].description }</td><td>${ postdate }</td><td>${ commentdate }</td><td>${ item.username }</td><td><button data-cid="${ item.id }" class="btn btn-success btn-sm edit-comment" ${ disableStatus }>edit</button>&nbsp;&nbsp;<button data-cid="${ item.id }" class="btn btn-danger btn-sm del-comment" ${ disableStatus }>delete</button></td></tr>`
                })
                $('#group-list').append(t)
            } else {
                alert(response.msg)
            }
        },
        error:function () {
            alert('server error')
        }
    })
}


$('body').on('click','.edit-comment',function () {
    let cid = $(this).data('cid')

    $.ajax({
        url:COMMENT_ARTICLE_API + '/' + cid,
        dataType:'json',
        type:'get',
        success:function (res) {
            console.log(res)
            if (res.success == true ) {
                $('#comment-content').val(res.data[0].content)
                $('#comment-cid').val(res.data[0]._id)
            }
            $('#commentModal').modal('show')

        },
        error:function () {
            alert('server error')
        }
    })

})


$('body').on('click','.del-comment',function () {
    let cid = $(this).data('cid')

    $.ajax({
        url:COMMENT_ARTICLE_API + '/' + cid,
        data:{
            "cid" : cid
        },
        dataType:'json',
        type:'DELETE',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.reload()
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
})

$('body').on('click','.del-collect',function () {
    let cid = $(this).data('cid')

    $.ajax({
        url:COLLECT_ARTICLE_API + '/' + cid,
        data:{
            "cid" : cid
        },
        dataType:'json',
        type:'DELETE',
        success:function (res) {
            alert(res.msg)
            if(res.success == true) {
                window.location.reload()
            } else {
                return false;
            }
        },
        error:function () {
            alert('server error')
        }
    })
})

function formattime(time) {

    if (time) {
        var date = new Date(time*1 + 8 * 3600 * 1000); 
        return date.toJSON().substr(0, 19).replace('T', ' ');
    } else {
        return  '-'
    }

}