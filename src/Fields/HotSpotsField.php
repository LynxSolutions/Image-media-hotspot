<?php

namespace Ebess\AdvancedNovaMediaLibrary\Fields;

use Laravel\Nova\Fields\Field;

class HotSpotsField extends Field
{
    /**
     * @var string
     */
    public $attribute = 'x-hotspots';
    public $component = 'advanced-media-hotspot';
}
