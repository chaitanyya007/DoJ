jQuery(document).ready(function($){
    $('body').on("submit",'.filterTabularContentForm',function(e){
        e.preventDefault();
        let $this = $(this);
        let data = {};

        let contentSection = $this.parents('.s3waas-tabular-content');
        let taxonomySection = contentSection.find('.taxonomy-section:first-child');
        let resultSection = contentSection.find('.tabular-result-container');
        let contentType = $this.parents('.s3waas-tabular-container').data('content-type');

        data.term_id = $this.find('select').val();

        if(data.term_id == -1) {
            location.reload();
            return;
        }


        data.params = contentSection.data('params');
        data.pageno = $(this).data('page-id');
        data.action = contentType+"_tax_filter";

        $.ajax({
            url: AwaasData.ajaxUrl,
            method: "POST",
            dataType: "json",
            data: data,
            beforeSend: function () {
                taxonomySection.find('.loader').show();
            },
            success: function (response) {
                resultSection.html(response.data.content);
            },
            complete: function () {
                taxonomySection.find('.loader').hide();
            }
        })

    });
    $("body .s3waas-tabular-content").on('click','.pagination a',function(e){
        e.preventDefault();
        let $this = $(this);

        if($this.parents('li').hasClass('current')) return;

        let data = {};
        let taxonomySection = $this.parents('.taxonomy-section');
        let contentSection = $this.parents('.s3waas-tabular-content');
        let contentType = $this.parents('.s3waas-tabular-container').data('content-type');

        data.termParams = taxonomySection.data('params');
        data.params = contentSection.data('params');
        data.pageno = $(this).data('page-id');
        data.action = contentType+"_paginate";

        $.ajax({
            url: AwaasData.ajaxUrl,
            method: "POST",
            dataType: "json",
            data: data,
            beforeSend: function () {
                taxonomySection.find('.loader').show();
            },
            success: function (response) {
                taxonomySection.find('tbody').replaceWith(response.data.content);
                taxonomySection.find('.pagination').replaceWith(response.data.pagination);
                $('body').trigger('targetExternalLinks');
            },
            complete: function () {
                taxonomySection.find('.loader').hide();
            }
        })
    });
})