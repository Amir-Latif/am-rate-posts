<?php

/**
 * Plugin Name: AM - Rate Posts
 * Plugin URI: https://amir-latif.github.io/portfolio/wp-plugins/amrp
 * Description: Adds rating functionality to posts
 * Version: 1.0
 * Requires at least: 5.2
 * Requires PHP: 7.2
 * Author: Amir Latif
 * Author URI: https://amir-latif.github.io/portfolio/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: WordPress Plugins
 */
?>
<?php

/* ========================
    Create DB table for rates
 ========================*/

function amrp_create_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'amrp';
    $charset_collate = $wpdb->get_charset_collate();

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

    $sql = "CREATE TABLE $table_name (
            id INTEGER NOT NULL AUTO_INCREMENT,
            target_id INTEGER NOT NULL,
            rate_up INTEGER NOT NULL DEFAULT 0,
            rate_down INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (id)
            ) $charset_collate;";

    dbDelta($sql);
}
register_activation_hook(__FILE__, "amrp_create_table");


/* ===================================
Display rates and results to all posts
======================================*/

function amrp_get_view()
{
    ob_start();
    include('templates/amrp-rating.php');
    return ob_get_clean();
}

function amrp_show_rates($content)
{
    if (is_page('add-feedback')) {
        return $content;
    } else {
        $rating_content = amrp_get_view();
        return  $content . $rating_content;
    }
}
add_filter('the_content', 'amrp_show_rates');


/*========================
Callback to postRates API
=========================*/
function amrp_post_data()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'amrp';
    $post_id = $_POST['postId'];
    $table_record = $wpdb->get_row("SELECT rate_up, rate_down
    FROM $table_name
    WHERE target_id = $post_id");

    if (!empty($table_record)) {

        $wpdb->update(
            $table_name,
            array(
                'rate_up' => (int) $_POST['rateUp'],
                'rate_down' => (int) $_POST['rateDown']
            ),
            array('target_id' => $post_id)
        );
    } else {
        $wpdb->insert(
            $table_name,
            array(
                'target_id' => $post_id,
                'rate_up' => $_POST['rateUp'],
                'rate_down' => $_POST['rateDown']
            ),
            array('%d', '%d', '%d')
        );
    }

    wp_die();
}
add_action('wp_ajax_nopriv_amrpRatePosts', 'amrp_post_data');
add_action('wp_ajax_amrpRatePosts', 'amrp_post_data');


/*============
Plugin Scripts
==============*/
function amrp_add_scripts()
{
    global $wpdb;
    $plugin_path = plugin_dir_url(__FILE__);
    $table_name = $wpdb->prefix . 'amrp';

    if (is_singular('post')) {
        $post_id = get_the_ID();
        $post_record = $wpdb->get_row("SELECT rate_up, rate_down FROM $table_name WHERE target_id = $post_id");

        wp_enqueue_style('amrpCss', $plugin_path . 'assets/amrp-styles.css', array(), time());
        wp_enqueue_script('amrpJs', $plugin_path . 'assets/amrp-script.js', array(), time(), true);
        wp_localize_script('amrpJs', 'amrpObject', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'postRecord' => $post_record,
            'postID' => $post_id,
        ));
    };
}
add_action('wp_enqueue_scripts', 'amrp_add_scripts');
?>