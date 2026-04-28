## MODIFIED Requirements

### Requirement: Settings Screen respects device safe area insets
The Settings Screen SHALL apply `useSafeAreaInsets()` top inset to the header area and bottom inset to the scroll content padding, ensuring no content is occluded by the notch, Dynamic Island, or home indicator on any iOS device.

#### Scenario: Header clears the notch
- **WHEN** the Settings Screen renders on a notched iPhone
- **THEN** the back chevron, "Settings" title, and gear icon are fully visible below the Dynamic Island / notch

#### Scenario: Scroll content clears the home indicator
- **WHEN** the Settings Screen renders on an iPhone with a home indicator
- **THEN** the last item in the scroll view can be scrolled fully above the home indicator without being obscured
