$(function() {

    window.cta = '/plugins';
    if (window.options.current_user.is_authenticated) window.cta = '/integrations/slack';

    var View = Backbone.View.extend({
        el: $('#slack-window'),
        template: $('#slack-message-template').html(),
        events: {
            'submit form#slack-search': 'noop',
            'submit #slack-message-input form': 'submitForm',
            'click #slack-help-icon': 'showHelpModal',
            'click a:not([href])': 'showHelpModal',
            'click .fa-chevron-down': 'showHelpModal',
            'click .fa-chevron-up': 'showHelpModal',
            'click .fa-cog': 'showHelpModal',
            'click .fa-star': 'showHelpModal',
            'click #team-name': 'showHelpModal',
            'click #slack-user': 'showHelpModal',
            'click #slack-active-channel .name': 'showHelpModal',
        },
        initalMessages: [
            {
                sender: {
                    name: 'alanhamlett',
                    avatar: 'https://secure.gravatar.com/avatar/5bbde3a573d9012842f5fd261caa0bfe?s=150&d=identicon',
                    url: 'https://wakatime.com/@alan',
                },
                message: {
                    time: moment().format('H:mm A'),
                    text: 'Welcome to the WakaTime + Slack demo! WakaTime is a quantified-self tool for programmers. Our open-source plugins show how long you\'ve spent coding.',
                },
            },
            {
                sender: {
                    name: 'alanhamlett',
                    avatar: 'https://secure.gravatar.com/avatar/5bbde3a573d9012842f5fd261caa0bfe?s=150&d=identicon',
                    url: 'https://wakatime.com/@alan',
                },
                message: {
                    time: moment().format('H:mm A'),
                    html: 'When you push to GitHub, <a href="' + window.cta + '" target="_blank">WakaTime</a> posts a Slack message with the time you spent coding on that commit.',
                },
            },
            {
                sender: {
                    name: 'WakaTime',
                    avatar: 'https://s3-us-west-2.amazonaws.com/slack-files2/bot_icons/2015-02-14/3727302660_48.png',
                    url: window.cta,
                    is_bot: true,
                },
                message: {
                    time: moment().format('H:mm A'),
                    text: '[sublime-wakatime:master] 1 new commit by Alan Hamlett:',
                    attachment: '<span class="animated">9 minutes</span> <a href="https://github.com/wakatime/sublime-wakatime/commit/307029c37a323528501e66774e172d183549de39" target="_blank">307029c</a>: detect python binary by executing interpreter - Alan Hamlett',
                },
                animate: true,
            },
            {
                sender: {
                    name: 'alanhamlett',
                    avatar: 'https://secure.gravatar.com/avatar/5bbde3a573d9012842f5fd261caa0bfe?s=150&d=identicon',
                    url: 'https://wakatime.com/@alan',
                },
                message: {
                    time: moment().format('H:mm A'),
                    html: 'Go ahead and <a href="' + window.cta + '" target="_blank">setup the integration</a> for your Slack team. You can also type a message here... we will respond if online.',
                },
            },
        ],
        render: function() {
            this.$el.find('#slack-message-input input[name="message"]').focus();
            setTimeout($.proxy(function() {
                $('#slack-loading').addClass('fadeOut');
                /*setTimeout($.proxy(function() {
                    this.showHelpModal();
                }, this), 300);*/
                this.addInitialMessages();
                setTimeout($.proxy(function() {
                    $('#slack-loading').remove();
                }, this), 1000);
            }, this), 1000);
            return this;
        },
        showHelpModal: function(e) {
            e && e.preventDefault();

            $('.modal').remove();
            var html = $('#modal-template').html();
            this.$el.append(Mustache.render(html, {
                title: 'Demo: WakaTime + GitHub + Slack = 42',
                body: '<p>This is a demo showing what the WakaTime + Slack integration would look like for your team. '
                     +'<a href="https://slack.com" target="_blank">Slack</a> is a team chat application which looks like the demo shown here. '
                     +'<a href="https://wakatime.com/" target="_blank">WakaTime</a> is a plugin for your text editor that shows how long you were actively coding. '
                     +'Connecting WakaTime + GitHub + Slack will post a message with the time each commit took to code, right inside your slack chat.'
                     +'<p>Things you can do:</p>'
                     +'<ul>'
                     +'<li>type a message and we might respond</li>'
                     +'<li><a href="/integrations/slack">setup the integration</a> to see your commits in slack</li>'
                     +'</ul>'
                     +'<p>Things you can NOT do:</p>'
                     +'<ul>'
                     +'<li>use any chat controls, because this isn\'t really a slack chat</li>'
                     +'</ul>'
                     +'<p class="p-top-xs-20">Please help by sharing!</p>'
                     +'<div style="height:40px;">'
                     +'<div class="m-right-xs-20" style="float:left;">'
                     +'<iframe src="//platform.twitter.com/widgets/tweet_button.1384994725.html#_=377230709693470&count=horizontal&id=twitter-widget-0&lang=en&original_referer=https%3A%2F%2Fwakatime.com%2Fslack&size=m&text=Improve%20team%20transparency%20with%20the%20%40WakaTime%20%2B%20%40Slack%20integration.%20%23quantifiedself&url=https%3A%2F%2Fwakatime.com%2Fslack&via=WakaTime" allowtransparency="true" frameborder="0" scrolling="no" style="width:100px; height:20px;"></iframe>'
                     +'</div>'
                     +'<div class="m-right-xs-20" style="float:left;">'
                     +'<iframe src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwakatime.com%2F&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=21&amp;appId=672782146122594" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:21px; width:90px;" allowTransparency="true"></iframe>'
                     +'</div>'
                     +'<div style="float:left;">'
                     +'<iframe src="/static/html/github-btn.html?user=wakatime&repo=wakatime&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="90" height="20"></iframe>'
                     +'</div>'
                     +'</div>',
            }));
            utils.hideModalWhenEscapePressed();
            $('.modal').modal().on('hidden.bs.modal', function (e) {
                $('#slack-message-input input[name="message"]').focus();
            });
        },
        addInitialMessages: function() {
            var data = this.initalMessages.shift();
            if (data) {
                setTimeout($.proxy(function() {
                    this.addMessage(data);
                    this.addInitialMessages();
                }, this), this.randomNumber(500, 3000));
            }
        },
        randomNumber: function(min, max) {
            return Math.random() * (max - min) + min;
        },
        addMessage: function(data) {
            var html = Mustache.render(this.template, data);
            var $message = $(html);
            this.$el.find('#slack-messages #table-cell').append($message);
            var height = this.$el.find('#slack-messages #slack-messages-body').height();
            this.$el.find('#slack-messages').animate({ scrollTop: height }, 0);
            if (data.animate) {
                var animation = 'rubberBand';
                this.animate($message, 'rubberBand', 6, 2000);
            }
        },
        animate: function($el, animateClass, number, timeout) {
            if (number > 0) {
                setTimeout($.proxy(function() {
                    $el.find('.animated').removeClass(animateClass);
                    $el.find('.animated')[0].offsetWidth = $el.find('.animated')[0].offsetWidth;
                    $el.find('.animated').addClass(animateClass);
                    this.animate($el, animateClass, number-1, timeout);
                }, this), timeout);
            }
        },
        sendMessage: function(data) {
            this.socket.emit('message', { from: this.options.current_user.username, text: data.message.text });
        },
        noop: function(e) {
            e && e.preventDefault();
        },
        submitForm: function(e) {
            e && e.preventDefault();

            var text = this.$el.find('#slack-message-input form input').val();
            if (text) {
                var data = {
                    sender: {
                        name: this.options.current_user.username,
                        avatar: this.options.current_user.photo,
                    },
                    message: {
                        time: moment().format('H:mm A'),
                        text: text,
                    },
                };
                this.sendMessage(data);
                this.addMessage(data);
                this.$el.find('#slack-message-input form input').val('');
            }
        },
        initialize: function(options) {
            this.options = _.defaults(options || {}, {});

            var url = 'https://' + this.options.chat_server_host + ':' + this.options.chat_server_port;
            this.socket = io(url);

            this.socket.on('error', function() {
                console.log('got error');
            });

            var username = this.options.current_user.username;
            if (username == 'anonymous' && this.options.current_user.email) username = this.options.current_user.email;
            this.socket.emit('join', { username: username});

            this.socket.on('message', $.proxy(function(data) {
                this.addMessage({
                    sender: {
                        name: data.sender.name,
                        avatar: data.sender.avatar,
                        url: data.sender.url,
                    },
                    message: {
                        time: moment().format('H:mm A'),
                        text: data.text,
                    },
                });
            }, this));

            return this;
        },
    });

    var project = new View(window.options);

    setTimeout($.proxy(project.render, project), 300);

});
